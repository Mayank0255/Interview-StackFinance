window.onload = function() {
	var main = document.getElementsByClassName("content-panel")[0];
	container.leaderSections(new LeaderLists({ main }));
	container.leaderSections(new LeaderLists({ main }));

	container.addLeader();
	container.addLeader();
	container.addLeader();
}

document.getElementById('add_leader').addEventListener('click', function(){
	container.addLeader();
})

class Container {
	constructor() {
		this.leaders = [];
		this.displays = [];
	}

	addLeader() {
		var leader_name = `Leader ${this.leaders.length + 1}`;
		let points = 0;
		if (this.leaders.length) {
			points = this.leaders[this.leaders.length - 1].points;
		}

		var leaderElement = {
			leader_name,
			points
		}

		this.leaders.push(leaderElement);

		this.displays.forEach(idx => idx.push (leaderElement));

		if (points) {
			this.changeLeader(leader_name, -points);
		}
	}

	leaderSections(display) {
		this.displays.push(display);
		display.insert();
	}

	changeLeader(name, points) {
		var leaderItem = this.leaders.find(({ leader_name }) => leader_name === name);
		var i = this.leaders.indexOf(leaderItem);

		leaderItem.points += points;

		let j = i;

		// negative numbers
		if (points < 0) {
			while (j + 1 < this.leaders.length) {
				if (leaderItem.points < this.leaders[j + 1].points) {
					this.leaders[j] = this.leaders[j + 1];
					++j;
				}
				else {
					break;
				}
			}
		}
		else {
			while (j - 1 > -1) {
				if (leaderItem.points > this.leaders[j - 1].points) {
					this.leaders[j] = this.leaders[j - 1];
					--j;
				}
				else {
					break;
				}
			}
		}
		this.leaders[j] = leaderItem;
		this.displays.forEach(d => d.switchLeader(leaderItem, i, j));
	}
}

var container = new Container();


class LeaderSections {
	constructor({ main }) {
		this.parent = main;
	}

	insert() {
		this.parent.appendChild(this.main);
	}

	insertOn(i) {
		let j = 0, node = this.parent.firstChild;
		while (j < i && node) {
			node = node.nextSibling;
			j++;
		}
		if (node) {
			this.parent.insertBefore(this.main, node);
		}
		else {
			this.parent.appendChild(this.main);
		}
	}

	static html(html) {
		var template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}
}

class LeaderLists extends LeaderSections {
	constructor(parentComponent) {
		super(parentComponent);
		this.main = LeaderSections.html(
			`<ul class="leader-list"></ul>`
		);
	}

	push(leaderItem) {new LeaderPanel(this, leaderItem).insert()}

	switchLeader(leaderItem, i, j) {
		let node = this.main.firstChild;
		for (let k = 0; k < i; ++k) {
			node = node.nextSibling;
		}
		this.main.removeChild(node);
		new LeaderPanel(this, leaderItem).insertOn(j);
	}
}

class LeaderPanel extends LeaderSections {
	constructor(parentComponent, leaderItem) {
		super(parentComponent)
		this.set(leaderItem);
	}

	set({ leader_name, points }) {
		this.main = LeaderSections.html(
			`	<li>
					${leader_name}
					&nbsp;
					<span class="count">${points}</span>
					&nbsp;
					<button class="add" onclick="container.changeLeader('${leader_name}', +1)">&plus;</button>
					<button class="sub" onclick="container.changeLeader('${leader_name}', -1)">&minus;</button>
				</li>
			`
		);
	}
}
