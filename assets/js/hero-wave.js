(async () => {
  const canvas = document.querySelector('.hero-bg canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl2', {alpha: false, antialias: false, powerPreference: 'low-power'});
  if (!gl) return; // The original published fallback image remains visible.
  let fragment;
  try {
    const response = await fetch(new URL('hero-wave.frag', document.currentScript?.src || new URL('assets/js/hero-wave.js', document.baseURI)));
    if (!response.ok) return;
    fragment = await response.text();
  } catch { return; }
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Hero wave shader:', gl.getShaderInfoLog(shader)); gl.deleteShader(shader); return null;
    }
    return shader;
  }
  const vertex = compile(gl.VERTEX_SHADER, `#version 300 es
in vec2 position;
out vec2 v_uv;
void main(){v_uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`);
  const pixel = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vertex || !pixel) return;
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, pixel); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(pixel);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniform = name => gl.getUniformLocation(program, name);
  const uniforms = {u_seed:1,u_waveSpeed:.15,u_waveAmplitude:.5,u_waveAngle:0,u_waveFreqX:1,u_waveFreqY:1,u_maskSoftness:2,u_blendAmount:0};
  Object.entries(uniforms).forEach(([key,value]) => gl.uniform1f(uniform(key),value));
  gl.uniform1i(uniform('u_colors_length'),3);
  gl.uniform4fv(uniform('u_colors[0]'),new Float32Array([166/255,161/255,251/255,1, 1,1,1,1, 252/255,88/255,43/255,1, 252/255,88/255,43/255,1]));
  const resolution = uniform('u_resolution'); const time = uniform('u_time');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, frame, elapsed = 0, last, drawn = 0;
  function draw() {
    const scale = Math.min(devicePixelRatio || 1, 1);
    const width = Math.max(1,Math.round(canvas.clientWidth*scale));
    const height = Math.max(1,Math.round(canvas.clientHeight*scale));
    if (canvas.width !== width || canvas.height !== height) {canvas.width=width;canvas.height=height;}
    gl.viewport(0,0,width,height); gl.uniform2f(resolution,width,height); gl.uniform1f(time,elapsed/1000);
    gl.drawArrays(gl.TRIANGLES,0,6);
    canvas.style.visibility = 'visible';
  }
  function tick(now) {
    if (!visible || document.hidden || reduced.matches) {last=undefined;frame=undefined;return;}
    if (last !== undefined) elapsed += now-last;
    last=now;
    if (now-drawn>=1000/30) {draw();drawn=now;}
    frame=requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(frame);frame=undefined;last=undefined;
    draw();
    if (visible && !document.hidden && !reduced.matches) frame=requestAnimationFrame(tick);
  }
  new ResizeObserver(resume).observe(canvas);
  new IntersectionObserver(entries => {visible=entries[0].isIntersecting;resume();}).observe(canvas);
  reduced.addEventListener('change',resume);
  document.addEventListener('visibilitychange',resume);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);canvas.style.visibility='hidden';});
  resume();
})();
