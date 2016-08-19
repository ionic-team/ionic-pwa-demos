export interface Player {
    initialize: (song: any, callback: (e) => void) => void;
	play: () => void;
	pause: () => void;
	seek: (time: number) => void;
	currentTime: () => number;
	totalTime: () => number;
	setVolume: (value: number) => void;
	getVolume: () => number;
	on: (event: number, handler: (data: any) => void) => void;
}