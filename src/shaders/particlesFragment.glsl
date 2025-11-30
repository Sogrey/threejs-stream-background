uniform sampler2D uMask;
uniform float uFocusPoint;  // 焦点深度
uniform float uFocusRange; // 景深范围

varying float vAlpha;
varying float vDepth;
varying float vSizeMultiplier;

void main()
{
    float maskStrength = texture(uMask, gl_PointCoord).r;
    
    // 景深模糊计算
    float depthDiff = abs(vDepth - uFocusPoint);
    float focusAmount = 1.0 - smoothstep(0.0, uFocusRange, depthDiff);
    
    // 深度影响亮度 - 近处更亮，远处更暗
    float depthBrightness = 1.0 - smoothstep(0.0, 40.0, vDepth - 10.0); // 10单位内最亮，40单位外最暗
    depthBrightness = max(0.15, depthBrightness); // 保证最低亮度
    
    // 景深影响透明度 - 焦点内清晰，焦点外模糊
    float focusAlpha = mix(0.05, 1.0, focusAmount); // 更强的透明度对比
    float finalAlpha = maskStrength * vAlpha * focusAlpha;
    
    // 结合深度和景深效果
    gl_FragColor = vec4(depthBrightness, depthBrightness, depthBrightness, finalAlpha);
}