import Page from "./../Page/Page.js";

export default class Graph {
	/*
	pages = صفحاتی که در گراف قرار دارند
	root = ریشه گراف
	datas = اضافه کردن گره
	*/
	constructor(pages, root, datas) {
		this.pages = pages;
		this.root = root;
		this.datas = datas;

		this.generateGraph().then((status) => {
			console.info(
				status ? "[o] Graphe construit." : "[!] Graphe non construit."
			);
		});
	}

	// حذف کردن تصادفی y 
	async randomRemove() {
		const page_x_id = Math.round(Math.random() * (this.pages.length - 1));
		if(this.pages[page_x_id].getOut().length > 0) {
			const element = this.pages[page_x_id].getOut().sort((a, b) => {
				b.getRelevance() - a.getRelevance()
			})[0]
			const ran = Math.floor(Math.random() * (element.getRelevance() * 100)) === 0;
			if(ran) {
				console.warn(ran)
				console.warn(this.pages[ran] || null)
				const deleted = await this.pages[page_x_id].deleteInOut(element.getId())
				this.pages[page_x_id].setOut(deleted)
			}
			console.warn(this.pages)
		}
	}

	// قسمت ایجاد جدول برای مقایسه الگوریتم
	async generateRanking() {
		let stock = [...this.pages]
		let sorted = stock.sort((a, b) => {
			return b.getPagerank() - a.getPagerank()
		})

		this.datas.innerHTML = ""

		for(let i = 0; i <= sorted.length-1; ++i) {
			const tr = document.createElement("tr")
			tr.setAttribute("class", "scoreboard-datas-line")

			const position = document.createElement("td")
			position.setAttribute("class", "scoreboard-datas")
			position.innerText = i+1

			const nom = document.createElement("td")
			nom.innerText = sorted[i].getName()

			if (i === 0) {
				nom.setAttribute("class", "scoreboard-datas first")
			} else if (i === 1) {
				nom.setAttribute("class", "scoreboard-datas second")
			} else if (i === 2) {
				nom.setAttribute("class", "scoreboard-datas third")
			}

			const score = document.createElement("td")
			score.innerText = (parseFloat(sorted[i].getPagerank())).toFixed(2)

			const rev = parseFloat(score.innerText)
			if (rev <= 0.09) {
				score.setAttribute("class", "scoreboard-datas red")
			} else if (rev <= 0.14) {
				score.setAttribute("class", "scoreboard-datas orange")
			} else {
				score.setAttribute("class", "scoreboard-datas green")
			}

			tr.appendChild(position)
			tr.appendChild(nom)
			tr.appendChild(score)

			this.datas.appendChild(tr)
		}
	}

	// محاسبه رنک تمام صفحات
	pagerank(d = 0.85, maxIterations = 100) {
		return new Promise((resolve, _) => {
			const N = this.pages.length;
			let PR = new Array(N).fill(1 / N);
	
			for (let iteration = 0; iteration <= maxIterations-1; ++iteration) {
				let newPR = new Array(N).fill(0);
	
				for (let i = 0; i <= N-1; ++i) {
					const outDegree = this.pages[i].getOut().length;
		
					if (outDegree > 0) {
						const contribution = PR[i] / outDegree;
	
						this.pages[i].getOut().forEach((page, __) => {
							const index = this.pages.indexOf(page);
							newPR[index] += contribution;
						});
					} else {
						const uniformContribution = PR[i] / N;
						newPR = newPR.map(rank => rank + uniformContribution);
					}
				}
		
				newPR = newPR.map(rank => (1 - d) / N + d * rank);
		
				if (this.isConverged(PR, newPR)) {
					console.info(`[o] PageRank convergé après ${iteration + 1} itérations.`);
					break;
				}
		
				PR = newPR;
			}
	
			for(let j = 0; j <= PR.length-1; ++j) {
				this.pages[j].setPagerank(PR[j])
			}
		
			resolve(PR)
		})
	}
	
	// ثبت امتیاز جدید و مقایسه آن با قبل
	isConverged(oldRanks, newRanks, threshold = 0.0001) {
		for (let i = 0; i <= oldRanks.length-1; ++i) {
			if (Math.abs(oldRanks[i] - newRanks[i]) > threshold) {
				return false;
			}
		}
		return true;
	}

	// پیاده سازی نمودار
	async generateGraph() {
		const generateCircularPositions = async (centerX, centerY, radius=200) => {
			const positions = [];
			const angleIncrement = (2 * Math.PI) / this.pages.length;
		
			for (let i = 0; i <= this.pages.length-1; ++i) {
				const angle = i * angleIncrement;
				const x = centerX + radius * Math.cos(angle);
				const y = centerY + radius * Math.sin(angle);
		
				positions.push({ x, y });
			}
		
			return positions;
		}

		const positions = await generateCircularPositions(this.root.width/2, this.root.height/2)

		for(let i = 0; i <= this.pages.length-1; ++i) {
			await this.pages[i].setPosition(positions[i])
		}
		
		const context = this.root.getContext("2d");
		context.fillStyle = "red";

		const canvasWidth = this.root.width;
		const canvasHeight = this.root.height;

		context.clearRect(0, 0, canvasWidth, canvasHeight);

		const drawArrow = (context, x1, y1, x2, y2, t = 0.9) => {
			const arrow = {
				dx: x2 - x1,
				dy: y2 - y1,
			};
		
			const middle = {
				x: arrow.dx * t + x1,
				y: arrow.dy * t + y1,
			};
		
			const tip = {
				dx: x2 - middle.x,
				dy: y2 - middle.y,
			};
		
			context.beginPath();
			context.moveTo(x1, y1);
			context.lineTo(middle.x, middle.y);
			context.moveTo(middle.x + 0.1 * tip.dy, middle.y - 0.1 * tip.dx);
			context.lineTo(middle.x - 0.1 * tip.dy, middle.y + 0.1 * tip.dx);
			context.lineTo(x2, y2);
			context.closePath();
			context.fillStyle = 'black';
			context.stroke();
			context.fill();
		};
		

		for (let i = 0; i <= this.pages.length - 1; ++i) {
			const { x, y } = await this.pages[i].getPosition();

			const radius = 20;

			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI);

			const rev = this.pages[i].getPagerank();
			if (rev <= 0.08) {
				context.fillStyle = "red";
			} else if (rev <= 0.14) {
				context.fillStyle = "orange";
			} else {
				context.fillStyle = "green";
			}

			context.fill();
			context.closePath();

			context.font = "12px Arial";
			context.fillStyle = "black";
			context.fillText(
				`${this.pages[i].name}`,
				x - radius - 15,
				y - radius - 2
			);
		}

		for(let i = 0; i <= this.pages.length-1; ++i) {
			const { x, y } = await this.pages[i].getPosition();
			const out = this.pages[i].getOut();

			if (out.length >= 1) {
				for (let j = 0; j <= out.length - 1; ++j) {
					const p2 = await out[j].getPosition();
					drawArrow(context, x, y, p2.x, p2.y, 0.9);
				}
			}
		}
	}

	// ورودی صفحه را آپدیت میکند
	updatePageIn(index, page) {
		console.info("ورودی جدید...");
		this.pages[index].addIn(page);
	}

	// خروجی صفحه را آپدیت میکند
	updatePageOut(index, page) {
		const ran =
			Math.floor(Math.random() * (page.getRelevance() * 100)) === 0;

		if (ran) {
			console.info("خروجی جدید از x...");
			this.pages[index].addOut(page);
			return true;
		} else {
			console.info("خروجی جدید از x...");
			return false;
		}
	}

	// تمامی صفحات بازگردانی میشود برای چک مجدد
	getPages() {
		return this.pages;
	}
}