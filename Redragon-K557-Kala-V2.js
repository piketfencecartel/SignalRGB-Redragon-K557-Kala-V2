export function Name() { return "Redragon K557 Kala V2"; }
export function VendorId() { return 0x320F; }
export function ProductId() { return [0x5000, 0x5055]; }
export function Publisher() { return "WhirlwindFx"; }
export function Size() { return [22, 6]; } 
export function DeviceType(){return "keyboard";}
export function Validate(endpoint) { return endpoint.interface === 1; }

export function ControllableParameters(){
	return [
		{property:"LightingMode", group:"lighting", label:"Modo de Iluminação", type:"combobox", values:["Canvas", "Forçado"], default:"Canvas"},
		{property:"forcedColor", group:"lighting", label:"Cor Forçada", type:"color", default:"#009bde"},
		// Adicionado o controle deslizante (Slider) para o usuário com a legenda instrutiva
		{property:"fpsLimit", group:"lighting", label:"Limite de FPS (Recomendado 28. Abaixe se a luz piscar ao digitar rápido)", type:"number", min:"15", max:"60", step:"1", default:"28"}
	];
}

// Mapa estático (Constante)
const Keymap = {
	0: ["Esc", [0, 0]], 1: ["'", [0, 1]], 2: ["Tab", [0, 2]], 3: ["Caps Lock", [0, 3]], 4: ["Left Shift", [0, 4]], 5: ["Left Ctrl", [0, 5]], 6: ["Num Lock", [18, 1]],
	8: ["F1", [1, 0]], 9: ["1", [1, 1]], 10: ["Q", [1, 2]], 11: ["A", [1, 3]], 12: ["\\", [1, 4]], 13: ["Windows", [1, 5]], 14: ["Numpad /", [19, 1]],
	16: ["F2", [2, 0]], 17: ["2", [2, 1]], 18: ["W", [2, 2]], 19: ["S", [2, 3]], 20: ["Z", [2, 4]], 21: ["Left Alt", [2, 5]], 22: ["Numpad *", [20, 1]],
	24: ["F3", [3, 0]], 25: ["3", [3, 1]], 26: ["E", [3, 2]], 27: ["D", [3, 3]], 28: ["X", [3, 4]], 30: ["Numpad -", [21, 1]],
	32: ["F4", [4, 0]], 33: ["4", [4, 1]], 34: ["R", [4, 2]], 35: ["F", [4, 3]], 36: ["C", [4, 4]], 38: ["Numpad 7", [18, 2]],
	40: ["F5", [5, 0]], 41: ["5", [5, 1]], 42: ["T", [5, 2]], 43: ["G", [5, 3]], 44: ["V", [5, 4]], 45: ["Espaço", [6, 5]], 46: ["Numpad 8", [19, 2]],
	48: ["F6", [6, 0]], 49: ["6", [6, 1]], 50: ["Y", [6, 2]], 51: ["H", [6, 3]], 52: ["B", [6, 4]], 54: ["Numpad 9", [20, 2]],
	56: ["F7", [7, 0]], 57: ["7", [7, 1]], 58: ["U", [7, 2]], 59: ["J", [7, 3]], 60: ["N", [7, 4]], 62: ["Numpad 4", [18, 3]],
	64: ["F8", [8, 0]], 65: ["8", [8, 1]], 66: ["I", [8, 2]], 67: ["K", [8, 3]], 68: ["M", [8, 4]], 70: ["Numpad 5", [19, 3]],
	72: ["F9", [9, 0]], 73: ["9", [9, 1]], 74: ["O", [9, 2]], 75: ["L", [9, 3]], 76: [",", [9, 4]], 77: ["Right Alt", [9, 5]], 78: ["Numpad 6", [20, 3]],
	80: ["F10", [10, 0]], 81: ["0", [10, 1]], 82: ["P", [10, 2]], 83: ["Ç", [10, 3]], 84: [".", [10, 4]], 85: ["Fn", [10, 5]], 86: ["Numpad +", [21, 3]],
	88: ["F11", [11, 0]], 89: ["-", [11, 1]], 90: ["´", [11, 2]], 91: ["~", [11, 3]], 92: [";", [11, 4]], 93: ["Menu", [11, 5]], 94: ["Numpad 2", [19, 4]],
	96: ["F12", [12, 0]], 97: ["=", [12, 1]], 98: ["[", [12, 2]], 99: ["]", [12, 3]], 100: ["/", [12, 4]], 101: ["Right Ctrl", [12, 5]], 102: ["Numpad 3", [20, 4]],
	104: ["PrtSc", [15, 0]], 105: ["Backspace", [13, 1]], 107: ["Enter", [13, 3]], 108: ["Right Shift", [13, 4]], 109: ["Seta Esquerda", [15, 5]], 110: ["Numpad 0", [18, 5]],
	112: ["ScrLk", [16, 0]], 113: ["Insert", [15, 1]], 114: ["Delete", [15, 2]], 115: ["Page Up", [16, 1]], 116: ["Seta Cima", [16, 4]], 117: ["Seta Baixo", [16, 5]], 118: ["Numpad Del", [20, 5]],
	120: ["Pause", [17, 0]], 121: ["Home", [16, 2]], 122: ["End", [16, 3]], 123: ["Page Down", [17, 1]], 124: ["Numpad 1", [18, 4]], 125: ["Seta Direita", [17, 5]], 126: ["Numpad Enter", [21, 5]]
};

export function Initialize() {
	device.set_endpoint(1, 0x0092, 0xff1c, 0x0004);
	EVISION.Initialize();
	EVISION.setSoftwareMode();
}

export function Render() {
	EVISION.sendColors();
}

export function Shutdown() {}

class EVISION_Device_Protocol {
	constructor() {
		this.RGBData = new Array(392).fill(0);
		this.RenderList = [];
		this.packetBuffer = new Array(64).fill(0); 
		this.lastRenderTime = 0;
	}

	Initialize() {
		const LedNames = [];
		const LedPositions = [];
		
		for (let id in Keymap) {
			const entry = Keymap[id];
			const keyId = parseInt(id);
			const x = entry[1][0];
			const y = entry[1][1];

			LedNames.push(entry[0]);
			LedPositions.push([x, y]);

			this.RenderList.push({
				idx: keyId * 3,
				x: x,
				y: y
			});
		}
		
		device.setName("Redragon K557 Kala V2");
		device.setSize([22, 6]);
		device.setControllableLeds(LedNames, LedPositions);
	}

	setSoftwareMode() {
		try {
			device.write([0x04, 0x8c, 0x00, 0x0b, 0x30, 0x50, 0x01], 64);
			device.pause(30);
		} catch (e) {
			device.log("Erro ao iniciar modo software: " + e);
		}
	}

	sendColors() {
		// --- THROTTLING DINÂMICO ---
		// Converte a escolha do usuário na interface (FPS) em milissegundos
		const targetDelay = 1000 / (typeof fpsLimit !== 'undefined' ? fpsLimit : 28);
		
		const agora = Date.now();
		if (agora - this.lastRenderTime < targetDelay) {
			return; // Respeita a cadência escolhida na barrinha
		}
		this.lastRenderTime = agora;
		// ---------------------------

		const isForced = LightingMode === "Forçado";
		let forcedRgb = [0, 0, 0];
		
		if (isForced) {
			forcedRgb = hexToRgb(forcedColor);
		}

		for (let i = 0; i < this.RenderList.length; i++) {
			const item = this.RenderList[i];
			let color = isForced ? forcedRgb : device.color(item.x, item.y);

			this.RGBData[item.idx]     = color[0];
			this.RGBData[item.idx + 1] = color[1];
			this.RGBData[item.idx + 2] = color[2];
		}

		this.writeRGBPackages();
	}

	writeRGBPackages() {
		for (let i = 0; i < 7; i++) {
			const start = i * 56;
			let sum = 0;
			
			for (let j = 0; j < 56; j++) {
				let val = this.RGBData[start + j] || 0;
				this.packetBuffer[8 + j] = val;
				sum += val;
			}

			const val = sum + start + 74;
			
			this.packetBuffer[0] = 0x04;
			this.packetBuffer[1] = val & 0xFF;             
			this.packetBuffer[2] = (val >>> 8) & 0xFF;     
			this.packetBuffer[3] = 0x12;                   
			this.packetBuffer[4] = 56;                     
			this.packetBuffer[5] = start & 0xFF;           
			this.packetBuffer[6] = (start >>> 8) & 0xFF;   
			this.packetBuffer[7] = 0x00;                   
			
			try {
				device.write(this.packetBuffer, 64);
				device.pause(2); 
			} catch (e) {}
		}
        
        device.pause(4); 
	}
}

const EVISION = new EVISION_Device_Protocol();

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0,0,0];
}
