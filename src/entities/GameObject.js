class GameObject {
	setCoords(x, y) {
		this.x = x;
		this.y = y;
	}
	serialize() {
		return [
			this.sid,
			this.x,
			this.y,
			this.dir,
			this.scale,
			this.type.
			this.data,
			this.ownerSID
		];
	}
	constructor(sid) {
		/*
		(sid, x, y, dir, s, type, data, setSID, owner)
		objectManager.add(
		data[i], /sid
		data[i + 1], /x
		data[i + 2], /y
		data[i + 3], /dir
		data[i + 4], /scale
        data[i + 5], /type
        items.list[data[i + 6]], /data
        true,
        (data[i + 7]>=0?{sid:data[i + 7]}:null));
		
		0 wood // 1 food // 2 stone
		2 wood wall //3 stone wall //4 spikes // 5g spikes //6 windmill //7 faster windmill //8 mine //9 pit trap //10 boostpad
		*/
		this.sid = sid;
		this.dir = 0;
		this.x = -1;
		this.y = -1;
		this.scale = 0;
		this.type = null;
		this.data = null;
		this.ownerSID = -1;
	}
}