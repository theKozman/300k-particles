uniform vec3 color;
uniform sampler2D pointTexture;

varying vec3 vColor;

void main() {

	gl_FragColor = vec4( color * vColor, 1.0 );
	vec4 texture = texture2D(pointTexture, gl_PointCoord);
    if(texture.g < 0.5) discard;
	gl_FragColor = gl_FragColor * texture;
}