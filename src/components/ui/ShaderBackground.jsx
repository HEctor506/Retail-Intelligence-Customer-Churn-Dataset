import { useEffect, useRef } from 'react'

// Adapted from 21st.dev ShaderBackground — used as header accent
export default function ShaderBackground({ className = '' }) {
  const canvasRef = useRef(null)

  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() { gl_Position = aVertexPosition; }
  `

  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    const float overallSpeed = 0.15;
    const float gridSmoothWidth = 0.015;
    const float axisWidth = 0.05;
    const float majorLineWidth = 0.025;
    const float minorLineWidth = 0.0125;
    const float majorLineFrequency = 5.0;
    const float minorLineFrequency = 1.0;
    const float scale = 5.0;
    const vec4 lineColor = vec4(0.5, 0.4, 1.0, 1.0);
    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.18;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      vec2 space = (gl_FragCoord.xy - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade   = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);
      vec4 bgColor1 = vec4(0.08, 0.06, 0.25, 1.0);
      vec4 bgColor2 = vec4(0.22, 0.08, 0.42, 1.0);

      for (int l = 0; l < linesPerGroup; l++) {
        float nli = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPos  = float(l) + space.x * offsetFrequency;
        float rand       = random(offsetPos + offsetTime) * 0.5 + 0.5;
        float halfWidth  = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset     = random(offsetPos + offsetTime * (1.0 + nli)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosY   = getPlasmaY(space.x, horizontalFade, offset);
        float line       = drawSmoothLine(linePosY, halfWidth, space.y) / 2.0
                         + drawCrispLine(linePosY, halfWidth * 0.15, space.y);

        float circleX   = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2  circlePosV = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle    = drawCircle(circlePosV, 0.01, space) * 4.0;

        lines += (line + circle) * lineColor * rand;
      }

      vec4 color = mix(bgColor1, bgColor2, uv.x);
      color *= verticalFade;
      color.a = 1.0;
      color += lines;
      gl_FragColor = color;
    }
  `

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    function compileShader(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null }
      return s
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource)
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource)
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const vertPos  = gl.getAttribLocation(prog, 'aVertexPosition')
    const uRes     = gl.getUniformLocation(prog, 'iResolution')
    const uTime    = gl.getUniformLocation(prog, 'iTime')

    function resize() {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    let raf, start = Date.now()
    function draw() {
      const t = (Date.now() - start) / 1000
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(vertPos, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(vertPos)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />
}
