(() => {
  'use strict';

  // The raised-hand source pose is rendered on a continuously moving surface.
  // No hand, sleeve or body part is cut out or rotated as a separate image.
  const scriptURL = document.currentScript?.src || document.baseURI;
  const textureURL = new URL('nan-li-avatar-sprite.png', scriptURL).href;
  const meshURL = new URL('avatar-wave-mesh.json', scriptURL).href;
  const CROPS = [[37.5, 13], [591.5, 14], [37.5, 616], [591.5, 616]];
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

  const vertexSource = `
    attribute vec2 aPositionA;
    attribute vec2 aPositionB;
    attribute vec2 aUvA;
    attribute vec2 aUvB;
    uniform float uMix;
    uniform vec2 uCropA;
    uniform vec2 uCropB;
    uniform vec2 uTextureSize;
    varying vec2 vUvA;
    varying vec2 vUvB;
    void main() {
      vec2 position = mix(aPositionA, aPositionB, uMix);
      gl_Position = vec4(position.x / 627.0 * 2.0 - 1.0,
                         1.0 - position.y / 627.0 * 2.0, 0.0, 1.0);
      vUvA = (aUvA + uCropA) / uTextureSize;
      vUvB = (aUvB + uCropB) / uTextureSize;
    }
  `;

  const fragmentSource = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform float uMix;
    varying vec2 vUvA;
    varying vec2 vUvB;
    void main() {
      // Uploading premultiplied pixels makes interpolation at the transparent
      // silhouette agree with the browser's premultiplied canvas compositor.
      vec4 colorA = texture2D(uTexture, vUvA);
      vec4 colorB = texture2D(uTexture, vUvB);
      gl_FragColor = mix(colorA, colorB, uMix);
    }
  `;

  function validateMesh(data) {
    if (!Array.isArray(data?.vertices) || data.vertices.length !== CROPS.length) {
      throw new Error('Avatar wave mesh must contain four corresponding poses.');
    }
    const coordinateCount = data.vertices[0]?.length;
    if (!Number.isInteger(coordinateCount) || coordinateCount < 6 || coordinateCount % 2) {
      throw new Error('Avatar wave mesh has invalid vertices.');
    }
    const vertexCount = coordinateCount / 2;
    if (vertexCount > 65535 || data.vertices.some((frame) =>
      !Array.isArray(frame) || frame.length !== coordinateCount ||
      frame.some((coordinate) => !Number.isFinite(coordinate)))) {
      throw new Error('Avatar wave mesh poses must share finite corresponding vertices.');
    }
    if (!Array.isArray(data.indices) || data.indices.length < 3 || data.indices.length % 3 ||
      data.indices.some((index) => !Number.isInteger(index) || index < 0 || index >= vertexCount)) {
      throw new Error('Avatar wave mesh has invalid triangle indices.');
    }
    if (data.uvs !== undefined && (!Array.isArray(data.uvs) || data.uvs.length !== CROPS.length ||
      data.uvs.some((frame) => !Array.isArray(frame) || frame.length !== coordinateCount ||
        frame.some((coordinate) => !Number.isFinite(coordinate))))) {
      throw new Error('Avatar wave UV poses must share finite corresponding vertices.');
    }
    if (data.textureFrames !== undefined && (!Array.isArray(data.textureFrames) ||
      data.textureFrames.length !== CROPS.length || data.textureFrames.some((frame) =>
        !Number.isInteger(frame) || frame < 0 || frame >= CROPS.length))) {
      throw new Error('Avatar wave texture frames must reference the source atlas.');
    }
    const vertices = data.vertices.map((frame) => new Float32Array(frame));
    return {
      vertices,
      uvs: data.uvs ? data.uvs.map((frame) => new Float32Array(frame)) : vertices,
      textureFrames: data.textureFrames || CROPS.map((_, frame) => frame),
      indices: new Uint16Array(data.indices)
    };
  }

  function initializeWave() {
    const button = document.querySelector('button[data-avatar]');
    if (!button || button.querySelector('.avatar-wave-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'avatar-wave-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.hidden = true;
    Object.assign(canvas.style, {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none'
    });
    button.append(canvas);

    const gl = canvas.getContext('webgl', {
      alpha: true, antialias: true, premultipliedAlpha: true,
      preserveDrawingBuffer: false
    });
    if (!gl) {
      canvas.remove();
      return;
    }

    const pose = { from: 0, to: 0, mix: 0 };
    const image = new Image();
    let mesh;
    let ready = false;
    let program;
    let texture;
    let vertexBuffers = [];
    let uvBuffers = [];
    let indexBuffer;
    let locations;
    let displayWidth = button.getBoundingClientRect().width || 154;

    function fallback() {
      ready = false;
      canvas.hidden = true;
      button.classList.remove('has-wave-tween');
    }

    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Avatar wave shader is unavailable.');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error('Avatar wave shader compilation failed.');
      }
      return shader;
    }

    function draw() {
      if (!ready || gl.isContextLost()) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[pose.from]);
      gl.enableVertexAttribArray(locations.positionA);
      gl.vertexAttribPointer(locations.positionA, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[pose.to]);
      gl.enableVertexAttribArray(locations.positionB);
      gl.vertexAttribPointer(locations.positionB, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffers[pose.from]);
      gl.enableVertexAttribArray(locations.uvA);
      gl.vertexAttribPointer(locations.uvA, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffers[pose.to]);
      gl.enableVertexAttribArray(locations.uvB);
      gl.vertexAttribPointer(locations.uvB, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1f(locations.mix, pose.mix);
      gl.uniform2fv(locations.cropA, CROPS[mesh.textureFrames[pose.from]]);
      gl.uniform2fv(locations.cropB, CROPS[mesh.textureFrames[pose.to]]);
      gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    function resize(width) {
      if (Number.isFinite(width) && width > 0) displayWidth = width;
      const ratio = clamp(window.devicePixelRatio || 1, 1, 2.5);
      const resolution = Math.max(1, Math.round(displayWidth * ratio));
      if (canvas.width !== resolution || canvas.height !== resolution) {
        canvas.width = resolution;
        canvas.height = resolution;
      }
      draw();
    }

    function prepare() {
      const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
      const highPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const fragmentShader = compile(gl.FRAGMENT_SHADER, highPrecision?.precision
        ? fragmentSource.replace('precision mediump float;', 'precision highp float;')
        : fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error('Avatar wave program is unavailable.');
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Avatar wave shader linking failed.');
      }
      gl.useProgram(program);
      locations = {
        positionA: gl.getAttribLocation(program, 'aPositionA'),
        positionB: gl.getAttribLocation(program, 'aPositionB'),
        uvA: gl.getAttribLocation(program, 'aUvA'),
        uvB: gl.getAttribLocation(program, 'aUvB'),
        mix: gl.getUniformLocation(program, 'uMix'),
        cropA: gl.getUniformLocation(program, 'uCropA'),
        cropB: gl.getUniformLocation(program, 'uCropB')
      };
      vertexBuffers = mesh.vertices.map((vertices) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        return buffer;
      });
      uvBuffers = mesh.uvs === mesh.vertices ? vertexBuffers : mesh.uvs.map((uvs) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
        return buffer;
      });
      indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
      gl.uniform2f(gl.getUniformLocation(program, 'uTextureSize'), image.naturalWidth, image.naturalHeight);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      ready = true;
      resize(displayWidth);
      if (gl.getError() !== gl.NO_ERROR) throw new Error('Avatar wave drawing failed.');
      canvas.hidden = false;
      button.classList.add('has-wave-tween');
      button.dispatchEvent(new CustomEvent('avatar:wave-ready'));
    }

    button.addEventListener('avatar:wave-pose', (event) => {
      const detail = event.detail;
      if (!detail || !Number.isInteger(detail.from) || !Number.isInteger(detail.to) ||
        detail.from < 0 || detail.from >= CROPS.length || detail.to < 0 ||
        detail.to >= CROPS.length || !Number.isFinite(detail.mix)) return;
      pose.from = detail.from;
      pose.to = detail.to;
      pose.mix = clamp(detail.mix, 0, 1);
      draw();
    });

    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      fallback();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      if (!mesh || !image.complete || !image.naturalWidth) return;
      try { prepare(); } catch { fallback(); }
    });

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver((entries) => {
        const entry = entries.find((candidate) => candidate.target === button);
        if (entry) resize(entry.contentRect.width);
      });
      observer.observe(button);
    }
    window.addEventListener('resize', () => resize(button.getBoundingClientRect().width), { passive: true });

    const imageReady = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = textureURL;
    });
    const meshReady = fetch(meshURL).then((response) => {
      if (!response.ok) throw new Error('Avatar wave mesh is unavailable.');
      return response.json();
    }).then(validateMesh);
    Promise.all([imageReady, meshReady]).then(([, meshData]) => {
      mesh = meshData;
      prepare();
    }).catch(fallback);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWave, { once: true });
  } else {
    initializeWave();
  }
})();
