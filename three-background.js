// Three.js Enhanced Background for AYP Tech
class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.connections = null;
        this.mouse = { x: 0, y: 0 };
        this.windowHalf = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        const container = document.getElementById('three-background');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            1, 
            3000
        );
        this.camera.position.z = 1000;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        container.appendChild(this.renderer.domElement);

        // Create particle system
        this.createParticles();
        
        // Create connections
        this.createConnections();
        
        // Create floating geometric shapes
        this.createGeometricShapes();
    }

    createParticles() {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0x6366f1); // Primary blue
        const color2 = new THREE.Color(0x8b5cf6); // Secondary purple
        const color3 = new THREE.Color(0x00d4ff); // Neon blue

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 1000;

            // Colors
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.33) {
                color = color1;
            } else if (colorChoice < 0.66) {
                color = color2;
            } else {
                color = color3;
            }
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Add floating animation
                    mvPosition.y += sin(time * 0.001 + position.x * 0.01) * 10.0;
                    mvPosition.x += cos(time * 0.001 + position.z * 0.01) * 5.0;
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - (distance * 2.0);
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createConnections() {
        const lineCount = 50;
        const positions = new Float32Array(lineCount * 6); // 2 points per line, 3 coords per point
        const colors = new Float32Array(lineCount * 6); // 2 colors per line, 3 components per color

        const color = new THREE.Color(0x6366f1);
        
        for (let i = 0; i < lineCount; i++) {
            const i6 = i * 6;
            
            // Start point
            positions[i6] = (Math.random() - 0.5) * 1500;
            positions[i6 + 1] = (Math.random() - 0.5) * 1500;
            positions[i6 + 2] = (Math.random() - 0.5) * 800;
            
            // End point
            positions[i6 + 3] = positions[i6] + (Math.random() - 0.5) * 200;
            positions[i6 + 4] = positions[i6 + 1] + (Math.random() - 0.5) * 200;
            positions[i6 + 5] = positions[i6 + 2] + (Math.random() - 0.5) * 200;

            // Colors for both points
            colors[i6] = color.r;
            colors[i6 + 1] = color.g;
            colors[i6 + 2] = color.b;
            colors[i6 + 3] = color.r;
            colors[i6 + 4] = color.g;
            colors[i6 + 5] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.3
        });

        this.connections = new THREE.LineSegments(geometry, material);
        this.scene.add(this.connections);
    }

    createGeometricShapes() {
        // Create floating wireframe shapes
        const shapes = [];
        
        // Dodecahedron
        const dodecahedronGeometry = new THREE.DodecahedronGeometry(50, 0);
        const dodecahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
        dodecahedron.position.set(-400, 200, -200);
        shapes.push(dodecahedron);

        // Icosahedron
        const icosahedronGeometry = new THREE.IcosahedronGeometry(40, 0);
        const icosahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
        icosahedron.position.set(400, -200, -300);
        shapes.push(icosahedron);

        // Octahedron
        const octahedronGeometry = new THREE.OctahedronGeometry(35, 0);
        const octahedronMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
        octahedron.position.set(0, 300, -400);
        shapes.push(octahedron);

        shapes.forEach(shape => {
            this.scene.add(shape);
        });

        this.geometricShapes = shapes;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now();

        // Update particle shader time
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = time;
        }

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x += 0.0005;
            this.particles.rotation.y += 0.001;
        }

        // Rotate connections
        if (this.connections) {
            this.connections.rotation.x += 0.0003;
            this.connections.rotation.y += 0.0007;
        }

        // Animate geometric shapes
        if (this.geometricShapes) {
            this.geometricShapes.forEach((shape, index) => {
                shape.rotation.x += 0.005 + index * 0.001;
                shape.rotation.y += 0.003 + index * 0.0005;
                shape.rotation.z += 0.002 + index * 0.0003;
                
                // Floating motion
                shape.position.y += Math.sin(time * 0.001 + index) * 0.5;
            });
        }

        // Mouse interaction
        if (this.camera) {
            this.camera.position.x += (this.mouse.x - this.camera.position.x) * 0.05;
            this.camera.position.y += (-this.mouse.y - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.scene.position);
        }

        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX - this.windowHalf.x) * 0.1;
            this.mouse.y = (event.clientY - this.windowHalf.y) * 0.1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.windowHalf.x = window.innerWidth / 2;
            this.windowHalf.y = window.innerHeight / 2;

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Scroll interaction
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (this.particles) {
                this.particles.rotation.x = scrollY * 0.0001;
            }
            if (this.connections) {
                this.connections.rotation.y = scrollY * 0.0002;
            }
        });
    }

    // Method to update colors based on theme
    updateTheme(primaryColor, secondaryColor, accentColor) {
        if (this.particles) {
            const colors = this.particles.geometry.attributes.color.array;
            const color1 = new THREE.Color(primaryColor);
            const color2 = new THREE.Color(secondaryColor);
            const color3 = new THREE.Color(accentColor);

            for (let i = 0; i < colors.length; i += 3) {
                const colorChoice = Math.random();
                let color;
                if (colorChoice < 0.33) {
                    color = color1;
                } else if (colorChoice < 0.66) {
                    color = color2;
                } else {
                    color = color3;
                }
                
                colors[i] = color.r;
                colors[i + 1] = color.g;
                colors[i + 2] = color.b;
            }
            
            this.particles.geometry.attributes.color.needsUpdate = true;
        }
    }

    // Method to pause/resume animation
    setPaused(paused) {
        this.paused = paused;
    }

    // Cleanup method
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('scroll', this.onScroll);
    }
}

// Initialize Three.js background when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page with the three-background element
    if (document.getElementById('three-background')) {
        window.threeBackground = new ThreeBackground();
    }
});

// Export for use in other scripts
window.ThreeBackground = ThreeBackground;