#ifdef GL_ES
precision mediump float;
#endif




uniform vec4 diffuse;
uniform vec4 ambient;
uniform vec4 specular;
uniform float shininess;


uniform vec3 normal;
uniform vec3 eye;
uniform vec3 lightDir;
uniform vec2 resolution;

void main()
{
    vec2 pos_ndc = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
    float dist = length(pos_ndc);

    vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);
    vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
    float step1 = 0.0;
    float step2 = 0.33;
    float step3 = 0.66;
    float step4 = 1.0;

    vec4 color = mix(white, red, smoothstep(step1, step2, dist));
    color = mix(color, blue, smoothstep(step2, step3, dist));
    color = mix(color, green, smoothstep(step3, step4, dist));

    gl_FragColor = (color);
}

// void main(){
//   vec4 spec = vec4(0.0);
//  vec4 colorOut = vec4(0, 0, 0, 0);
//     vec3 n = normalize(normal);
//     vec3 l = normalize(lightDir);
//     vec3 e = normalize(eye);
 
//     float intensity = max(dot(n,l), 0.0);
//     if (intensity > 0.0) {
//         vec3 h = normalize(l + e);
//         float intSpec = max(dot(h,n), 0.0);
//         spec = specular * pow(intSpec, shininess);
//     }
 
//     colorOut = max(intensity * diffuse + spec, ambient);
//     gl_FragColor = colorOut;
// }

