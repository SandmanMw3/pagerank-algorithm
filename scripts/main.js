import Graph from "./class/Graph/Graph.js";
import Page from "./class/Page/Page.js";

// زمان اجرای مجدد کد
const timingInterval = 30

// بعد از لود صفحه کد زیر اجرا میشود
window.addEventListener("load", () => {
	// المنت های صفحه را با دیتا سینک میکنن
	const ROOT = document.getElementById("root")
	const DATAS = document.getElementById("scoreboard-datas-container")

	// متغیر شمارش اجرای هر بار کد
	let T = 0;

	// آرایه تستی و دستی برای پیاده سازی الگوریتم
	const PGS = [
		new Page(0, "Instagram", 1/9),
		new Page(1, "Google", 1/8),
		new Page(2, "Discord", 1/7),
		new Page(3, "X", 1/7),
		new Page(4, "Telegram", 1/6),
		new Page(5, "Facebook", 1/5),
		new Page(6, "Skype", 1/3),
		new Page(7, "Varzesh3", 1/2),
	]; 

	// ایجاد متغیر برای پیاده سازی گراف
	const gr = new Graph(PGS, ROOT, DATAS);

	// graph.js را فراخوانی و پیاده سازی میکند
	setInterval(async () => {
		// جدا سازی لاگ
		console.log("==========")

		const allPages = gr.getPages();

		// میزان اجرای هر بار دستور و عدد تصادفی را رند میکند برای x,y 
		console.info(`\n[T ${T}]`);
		const page_x_id = Math.round(Math.random() * (allPages.length - 1));
		let page_y_id = Math.round(Math.random() * (allPages.length - 1));

		/*
		چک کردن مقدار x,y 
		و تغییر x در صورت تساوی
		*/
		while (page_y_id === page_x_id) {
			page_y_id = Math.round(Math.random() * (allPages.length - 1));
		}

		console.log(
			`Page x: ${allPages[page_x_id].getId()} (${allPages[
				page_x_id
			].getName()})`
		);

		console.log(
			`Page y: ${allPages[page_y_id].getId()} (${allPages[
				page_y_id
			].getName()})`
		);
		
		// پیاده سازی گراف
		if (gr.updatePageOut(page_x_id, allPages[page_y_id])) {
			gr.updatePageIn(page_y_id, allPages[page_x_id]);
		}

		await gr.pagerank()
		await gr.generateGraph()
		await gr.generateRanking()
		await gr.randomRemove()

		console.log(gr.getPages());
		T++;
	}, timingInterval)
});