export default class Page {
    /**
    id = شناسنامه صفحه.
    name = اسم سایت.
    relevance = نمره دستی سایت
    */
    constructor(id, name, relevance) {
        this.id = id
        this.name = name
        this.position = {x: 0, y: 0}
        this.pagerank = 0.0
        this.relevance = relevance

        this.out = []
        this.in = []
    }

    getRelevance() {
        return this.relevance
    }

    // تغییر رنک سایت
    updatePagerank(newPagerank) {
        this.pagerank = newPagerank
    }

    // آپدیت رنک سایت
    setPagerank(n) {
        this.pagerank = n
    }
    getPagerank() { 
        return this.pagerank 
    }

    // خروجی
    getOut() {
        return this.out
    }

    // اضافه کردن لینک جدید در جدول
    setOut(out) {
        this.out = out
    }
    
    // حذف صفحه های ایندکس شده قبلی
    async deleteInOut(index) {
        if(this.out.length <= 0) return
        let tmp = []
        for(let i = 0; i <= this.out.length-1; ++i) {
            if(this.out[i].getId() !== index) {
                console.warn(i, index)
                tmp.push(this.out[i])
            }
        }
        console.warn("supprimer", tmp)
        this.out = tmp
        return tmp
    }

    getIn() {
        return this.out
    }

    // چک کردن اتصال لینک ورودی صفحه
    addIn(id_y) {
        try {
            for(let i = 0; i <= this.in.length-1; ++i) {
                if((this.in[i].getName() === id_y.getName()) && (this.in[i].getId() === id_y.getId())) {
                    return false
                }
            }
            this.in.push(id_y)
            return true
        } catch(err) {}
    }

    // چک کردن اتصال لینک خروجی صفحه
    addOut(p_y) {
        try {
            for(let i = 0; i <= this.out.length-1; ++i) {
                if((this.out[i].getName() === p_y.getName()) && (this.out[i].getId() === p_y.getId())) {
                    return false
                }
            }
            this.out.push(p_y)
            return true
        } catch(err) {}
    }

    // تغییر موقیت برای گراف
    async setPosition(position) {
        this.position = position;
    }

    // گرفتن موقعیت جدید
    async getPosition() {
        return this.position
    }

    getId() { 
        return this.id 
    }

    getName() { 
        return this.name 
    }
}