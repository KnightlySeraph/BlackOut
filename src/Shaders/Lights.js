// import Phaser from 'phaser'

// // Content pulled from
// // Link: https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/lighting.php

// class Light extends Phaser.Filter {
//   contructor(game) {
//     super(game)

//     // Set Uniforms


//     // GLSL Frag Code
//     this.fragmentSrc = [
//         'struct gl_LightSourceParameters 
//           {   
//             vec4 ambient;              // Aclarri   
//             vec4 diffuse;              // Dcli   
//             vec4 specular;             // Scli   
//             vec4 position;             // Ppli   
//             vec4 halfVector;           // Derived: Hi   
//             vec3 spotDirection;        // Sdli   
//             float spotExponent;        // Srli   
//             float spotCutoff;          // Crli                              
//                                         // (range: [0.0,90.0], 180.0)   
//             float spotCosCutoff;       // Derived: cos(Crli)                 
//                                         // (range: [1.0,0.0],-1.0)   
//             float constantAttenuation; // K0   
//             float linearAttenuation;   // K1   
//             float quadraticAttenuation;// K2  
//         };    


//         uniform gl_LightSourceParameters gl_LightSource[gl_MaxLights];

//         struct gl_MaterialParameters  
//         {   
//           vec4 emission;    // Ecm   
//           vec4 ambient;     // Acm   
//           vec4 diffuse;     // Dcm   
//           vec4 specular;    // Scm   
//           float shininess;  // Srm  
//         };  


//         uniform gl_MaterialParameters gl_FrontMaterial;  
//         uniform gl_MaterialParameters gl_BackMaterial;   

//         struct gl_LightModelProducts  
//         {    
//           vec4 sceneColor; // Derived. Ecm + Acm * Acs  
//         };  


//         uniform gl_LightModelProducts gl_FrontLightModelProduct;  
//         uniform gl_LightModelProducts gl_BackLightModelProduct;      


//         struct gl_LightProducts 
//         {   
//           vec4 ambient;    // Acm * Acli    
//           vec4 diffuse;    // Dcm * Dcli   
//           vec4 specular;   // Scm * Scli  
//         };  


//         uniform gl_LightProducts gl_FrontLightProduct[gl_MaxLights];  
//         uniform gl_LightProducts gl_BackLightProduct[gl_MaxLights];

//         varying vec3 N;
//         varying vec3 v;

//         void main(void)
//         {
//           vec3 L = normalize(gl_LightSource[0].position.xyz - v);   
//           vec4 Idiff = gl_FrontLightProduct[0].diffuse * max(dot(N,L), 0.0);  
//           Idiff = clamp(Idiff, 0.0, 1.0); 

//           gl_FragColor = Idiff;
//         }'
//     ]
//   }
// }
