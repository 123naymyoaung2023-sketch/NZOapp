const { useState, useEffect, useMemo, useRef } = React;

const Icon = ({ name, className }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current && window.lucide) {
            ref.current.innerHTML = `<i data-lucide="${name}" class="${className || ''}"></i>`;
            window.lucide.createIcons({ root: ref.current, nameAttr: 'data-lucide' });
        }
    }, [name, className]);
    return <span ref={ref} className="inline-flex items-center justify-center"></span>;
};

const trans = {
    mm: { dashboard: 'အစီရင်ခံစာ', customer: 'ဖောက်သည်', purchase: 'ဝယ်ယူမှု', sale: 'အရောင်း', expense: 'အသုံးစရိတ်', settings: 'ဆက်တင်', name: 'အမည်', age: 'အသက်', gender: 'ကျား/မ', phone: 'ဖုန်းနံပါတ်', diagnosis: 'မှတ်ချက်', add: 'ထည့်မည်', edit: 'ပြင်မည်', delete: 'ဖျက်မည်', save: 'သိမ်းမည်', cancel: 'ပယ်ဖျက်မည်', confirm: 'အတည်ပြုမည်', search: 'ရှာဖွေရန်...', sortAlpha: 'အက္ခရာစဉ်', sortDate: 'ရက်စွဲစဉ်', product: 'ကုန်ပစ္စည်း', buyPrice: 'ဝယ်စျေး', sellPrice: 'ရောင်းစျေး', expDate: 'သက်တမ်းကုန်ရက်', qty: 'အရေအတွက်', addToCart: 'ခြင်းထဲထည့်မည်', checkout: 'ငွေရှင်းမည်', serviceFee: 'ဝန်ဆောင်ခ', amount: 'ပမာဏ', deductFrom: 'မည်သည့်ထဲမှနုတ်မည်နည်း', profit: 'အမြတ်', total: 'စုစုပေါင်း', daily: 'နေ့စဉ်', weekly: 'အပတ်စဉ်', monthly: 'လစဉ်', yearly: 'နှစ်စဉ်', allTime: 'အားလုံး', top20: 'အရောင်းရဆုံး (၂၀)', stockValue: 'လက်ရှိအရင်းစုစုပေါင်း', backup: 'Backup ယူမည်', restore: 'Restore လုပ်မည်', lang: 'ဘာသာစကား', theme: 'အလင်း/အမှောင်', male: 'ကျား', female: 'မ', empty: 'အချက်အလက်မရှိပါ', confirmDelete: 'ဖျက်ရန် သေချာပါသလား?', shopName: 'ဆိုင်အမည်', login: 'အကောင့်ဝင်မည်', signup: 'Admin အကောင့် ဖွင့်မည်', username: 'အမည် (Username)', password: 'စကားဝှက် (Password)', logout: 'အကောင့်မှ ထွက်မည်', manageUsers: 'ဝန်ထမ်းအကောင့်များ စီမံရန်', role: 'ရာထူး', staff: 'Staff (ဝန်ထမ်း)' },
    en: { dashboard: 'Report', customer: 'Customer', purchase: 'Purchase', sale: 'Sale', expense: 'Expense', settings: 'Settings', name: 'Name', age: 'Age', gender: 'Gender', phone: 'Phone', diagnosis: 'Remark', add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', confirm: 'Confirm', search: 'Search...', sortAlpha: 'Alphabetical', sortDate: 'By Date', product: 'Product', buyPrice: 'Buy Price', sellPrice: 'Sell Price', expDate: 'Exp Date', qty: 'Qty', addToCart: 'Add to Cart', checkout: 'Checkout', serviceFee: 'Service Fee', amount: 'Amount', deductFrom: 'Deduct From', profit: 'Profit', total: 'Total', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly', allTime: 'All Time', top20: 'Top 20 Selling', stockValue: 'Current Stock Value', backup: 'Backup Data', restore: 'Restore Data', lang: 'Language', theme: 'Theme', male: 'Male', female: 'Female', empty: 'No data available', confirmDelete: 'Are you sure to delete?', shopName: 'Shop Name', login: 'Log In', signup: 'Sign Up Admin', username: 'Username', password: 'Password', logout: 'Log Out', manageUsers: 'Manage Staff Accounts', role: 'Role', staff: 'Staff' }
};

const App = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); 
    const [activeTab, setActiveTab] = useState('sale'); 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    
    const [customers, setCustomers] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [lang, setLang] = useState('mm');
    const [theme, setTheme] = useState('dark');
    const [shopName, setShopName] = useState('LUNA POS');

    const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'alert', onConfirm: null, confirmText: '', cancelText: '' });
    const [printingSale, setPrintingSale] = useState(null);

    const t = trans[lang];
    const isDark = theme === 'dark';
    const boxClass = isDark ? 'neu-box-dark' : 'neu-box-light';
    const btnClass = isDark ? 'neu-btn-dark' : 'neu-btn-light';
    const inputClass = isDark ? 'neu-input-dark' : 'neu-input-light';

    useEffect(() => {
        setUsers(JSON.parse(localStorage.getItem('luna_users')) || []);
        const lAuth = JSON.parse(localStorage.getItem('luna_auth'));
        if(lAuth) {
            setCurrentUser(lAuth);
            setActiveTab(lAuth.role === 'admin' ? 'dashboard' : 'sale');
        }
        setCustomers(JSON.parse(localStorage.getItem('luna_customers')) || []); 
        setInventory(JSON.parse(localStorage.getItem('luna_inventory')) || []); 
        setSales(JSON.parse(localStorage.getItem('luna_sales')) || []); 
        setExpenses(JSON.parse(localStorage.getItem('luna_expenses')) || []);
        const lSettings = JSON.parse(localStorage.getItem('luna_settings')) || { lang: 'mm', theme: 'dark', shopName: 'LUNA POS' };
        setLang(lSettings.lang); setTheme(lSettings.theme); setShopName(lSettings.shopName || 'LUNA POS');
        document.body.className = lSettings.theme === 'dark' ? 'dark-theme hide-scroll min-h-screen' : 'light-theme hide-scroll min-h-screen';
    }, []);

    useEffect(() => { localStorage.setItem('luna_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { 
        if(currentUser) localStorage.setItem('luna_auth', JSON.stringify(currentUser));
        else localStorage.removeItem('luna_auth');
    }, [currentUser]);
    useEffect(() => { localStorage.setItem('luna_customers', JSON.stringify(customers)); }, [customers]);
    useEffect(() => { localStorage.setItem('luna_inventory', JSON.stringify(inventory)); }, [inventory]);
    useEffect(() => { localStorage.setItem('luna_sales', JSON.stringify(sales)); }, [sales]);
    useEffect(() => { localStorage.setItem('luna_expenses', JSON.stringify(expenses)); }, [expenses]);
    useEffect(() => { 
        localStorage.setItem('luna_settings', JSON.stringify({lang, theme, shopName}));
        if(!printingSale) document.body.className = theme === 'dark' ? 'dark-theme hide-scroll min-h-screen' : 'light-theme hide-scroll min-h-screen';
    }, [lang, theme, shopName, printingSale]);

    // History API: Back Button Navigates Drawer & Modals instead of quitting
    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        const handleBack = () => {
            if (dialog.isOpen) { setDialog(prev => ({ ...prev, isOpen: false })); }
            else if (isDrawerOpen) { setIsDrawerOpen(false); }
            else if (printingSale) { setPrintingSale(null); }
            else if (activeTab !== 'sale' && activeTab !== 'dashboard') {
                setActiveTab(currentUser?.role === 'admin' ? 'dashboard' : 'sale');
            }
            window.history.pushState(null, null, window.location.pathname);
        };
        window.addEventListener('popstate', handleBack);
        return () => window.removeEventListener('popstate', handleBack);
    }, [dialog.isOpen, isDrawerOpen, printingSale, activeTab, currentUser]);

    const showAlert = (title, message) => setDialog({ isOpen: true, title, message, type: 'alert', confirmText: 'OK' });
    const showConfirm = (title, message, onConfirmCallback, confirmText = t.delete, cancelText = t.cancel) => {
        setDialog({ isOpen: true, title, message, type: 'confirm', onConfirm: onConfirmCallback, confirmText, cancelText });
    };
    const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));
    const formatDateTime = (ts) => { const d = new Date(ts); return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`; };
    const formatDateOnly = (ts) => new Date(ts).toLocaleDateString();

    const DrawerNav = () => {
        const navItems = [
            { id: 'dashboard', icon: 'bar-chart-2', label: t.dashboard, roles: ['admin'] },
            { id: 'customer', icon: 'users', label: t.customer, roles: ['admin', 'staff'] },
            { id: 'purchase', icon: 'package', label: t.purchase, roles: ['admin', 'staff'] },
            { id: 'sale', icon: 'shopping-cart', label: t.sale, roles: ['admin', 'staff'] },
            { id: 'expense', icon: 'trending-down', label: t.expense, roles: ['admin', 'staff'] },
            { id: 'settings', icon: 'settings', label: t.settings, roles: ['admin', 'staff'] }
        ].filter(item => item.roles.includes(currentUser?.role));

        return (
            <>
                {isDrawerOpen && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>}
                <div className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} ${boxClass} p-6 flex flex-col gap-4 shadow-2xl border-r border-white/10`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="luna-title text-2xl">LUNA</h2>
                        <button onClick={() => setIsDrawerOpen(false)} className="p-2"><Icon name="x" className="w-6 h-6" /></button>
                    </div>
                    {navItems.map(item => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); setIsDrawerOpen(false); }} className={`flex items-center gap-4 p-4 rounded-2xl transition ${activeTab === item.id ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : 'opacity-80 hover:bg-black/10'}`}>
                            <Icon name={item.icon} className="w-6 h-6" />
                            <span className="font-bold text-lg">{item.label}</span>
                        </button>
                    ))}
                </div>
            </>
        );
    };

    const AuthView = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const hasAdmin = users.some(u => u.role === 'admin');

        const handleAuth = () => {
            if(!username || !password) return showAlert('အမှား', 'အမည် နှင့် စကားဝှက် ထည့်ပါ။');
            if(!hasAdmin) {
                const newAdmin = { id: Date.now(), name: username, password, role: 'admin' };
                setUsers([newAdmin]);
                setCurrentUser(newAdmin);
                setActiveTab('dashboard');
            } else {
                const user = users.find(u => u.name === username && u.password === password);
                if(user) { setCurrentUser(user); setActiveTab(user.role === 'admin' ? 'dashboard' : 'sale'); }
                else { showAlert('အမှား', 'အမည် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။'); }
            }
        };

        return (
            <div className="flex flex-col items-center justify-center p-4 h-[70vh]">
                <div className={`w-full max-w-sm p-8 rounded-3xl ${boxClass} space-y-6 shadow-2xl`}>
                    <h2 className="text-2xl font-bold text-center mb-6">{!hasAdmin ? t.signup : t.login}</h2>
                    {!hasAdmin && <p className="text-sm opacity-70 text-center mb-4 text-blue-400">ပထမဆုံးအနေဖြင့် Admin အကောင့် ဖန်တီးပါ။</p>}
                    <div className="space-y-4">
                        <input type="text" placeholder={t.username} className={`w-full p-4 rounded-xl ${inputClass}`} value={username} onChange={e=>setUsername(e.target.value)} />
                        <input type="password" placeholder={t.password} className={`w-full p-4 rounded-xl ${inputClass}`} value={password} onChange={e=>setPassword(e.target.value)} />
                        <button className={`w-full p-4 font-bold rounded-xl bg-blue-600 text-white shadow-lg text-lg mt-4`} onClick={handleAuth}>
                            {!hasAdmin ? t.signup : t.login}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const CustomerView = () => {
        const [search, setSearch] = useState('');
        const [sortBy, setSortBy] = useState('date');
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editId, setEditId] = useState(null);
        const [form, setForm] = useState({ name: '', age: '', gender: 'male', phone: '', diagnosis: '' });

        const filtered = useMemo(() => {
            let res = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
            if(sortBy === 'alpha') res.sort((a,b) => a.name.localeCompare(b.name));
            else res.sort((a,b) => b.createdAt - a.createdAt);
            return res;
        }, [customers, search, sortBy]);

        const saveCustomer = () => {
            if(!form.name) return showAlert('အမှား', 'အမည် ထည့်သွင်းရန် လိုအပ်ပါသည်။');
            if(editId) {
                setCustomers(customers.map(c => c.id === editId ? {...c, ...form} : c));
                setSales(sales.map(s => s.customerId === editId ? {...s, customerName: form.name} : s));
            } else { setCustomers([...customers, { ...form, id: Date.now(), createdAt: Date.now() }]); }
            setIsModalOpen(false); setForm({ name: '', age: '', gender: 'male', phone: '', diagnosis: '' }); setEditId(null);
        };

        const deleteCustomer = (id) => {
            const hasSales = sales.some(s => s.customerId === id);
            let msg = t.confirmDelete;
            if(hasSales) msg = `သတိပြုရန်: ဤဖောက်သည်တွင် အရောင်းမှတ်တမ်းများရှိပါသည်။\nဖျက်လိုက်ပါက မှတ်တမ်းဟောင်းများတွင် အမည်ပျောက်သွားပါမည်။\nဆက်ဖျက်မည်လား?`;
            showConfirm('ဖျက်ရန် အတည်ပြုပါ', msg, () => setCustomers(customers.filter(c => c.id !== id)));
        };

        return (
            <div className="p-4 pb-safe space-y-4">
                <div className="flex gap-2">
                    <input type="text" placeholder={t.search} className={`flex-1 p-3 rounded-xl ${inputClass} outline-none`} value={search} onChange={e=>setSearch(e.target.value)} />
                    <button className={`p-3 px-5 font-bold ${btnClass}`} onClick={() => { setEditId(null); setForm({ name: '', age: '', gender: 'male', phone: '', diagnosis: '' }); setIsModalOpen(true); }}>+</button>
                </div>
                <div className="flex gap-2">
                    <button className={`flex-1 p-2 text-sm rounded-lg ${sortBy==='alpha'? btnClass : 'opacity-50'}`} onClick={()=>setSortBy('alpha')}>{t.sortAlpha}</button>
                    <button className={`flex-1 p-2 text-sm rounded-lg ${sortBy==='date'? btnClass : 'opacity-50'}`} onClick={()=>setSortBy('date')}>{t.sortDate}</button>
                </div>
                <div className="space-y-3">
                    {filtered.length === 0 && <p className="text-center opacity-50">{t.empty}</p>}
                    {filtered.map(c => (
                        <div key={c.id} className={`p-4 rounded-2xl ${boxClass} flex flex-col gap-2`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{c.name} <span className="text-sm font-normal opacity-70">({c.age}, {c.gender === 'male' ? t.male : t.female})</span></h3>
                                    <p className="text-sm opacity-80">{c.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={()=>{setEditId(c.id); setForm(c); setIsModalOpen(true);}} className="text-blue-400 p-2"><Icon name="edit-2" className="w-5 h-5" /></button>
                                    <button onClick={()=>deleteCustomer(c.id)} className="text-[#e57373] p-2"><Icon name="trash-2" className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg ${inputClass} text-sm mt-1`}>{t.diagnosis}: {c.diagnosis}</div>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4">
                        <div className={`w-full max-w-md p-6 rounded-2xl ${boxClass} space-y-4`}>
                            <h2 className="font-bold text-xl">{editId ? t.edit : t.add} {t.customer}</h2>
                            <input placeholder={t.name} className={`w-full p-3 rounded-xl ${inputClass}`} value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="number" placeholder={t.age} className={`w-1/2 p-3 rounded-xl ${inputClass}`} value={form.age} onChange={e=>setForm({...form, age: e.target.value})} />
                                <select className={`w-1/2 p-3 rounded-xl ${inputClass}`} value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})}>
                                    <option value="male">{t.male}</option>
                                    <option value="female">{t.female}</option>
                                </select>
                            </div>
                            <input placeholder={t.phone} type="tel" className={`w-full p-3 rounded-xl ${inputClass}`} value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
                            <textarea placeholder={t.diagnosis} className={`w-full p-3 rounded-xl ${inputClass} h-24`} value={form.diagnosis} onChange={e=>setForm({...form, diagnosis: e.target.value})}></textarea>
                            <div className="flex gap-2 pt-2">
                                <button className={`flex-1 p-3 font-bold rounded-xl ${btnClass}`} onClick={()=>setIsModalOpen(false)}>{t.cancel}</button>
                                <button className={`flex-1 p-3 font-bold rounded-xl bg-blue-600 text-white shadow-lg`} onClick={saveCustomer}>{t.save}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const PurchaseView = () => {
        const [search, setSearch] = useState('');
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [editId, setEditId] = useState(null);
        const [form, setForm] = useState({ name: '', buyPrice: '', sellPrice: '', expDate: '', qty: '' });

        const filtered = useMemo(() => {
            let res = inventory.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
            res.sort((a,b) => a.name.localeCompare(b.name));
            return res;
        }, [inventory, search]);

        const getWarningClass = (expDate, qty) => {
            if (!expDate) return '';
            const monthsDiff = (new Date(expDate) - new Date()) / (1000 * 60 * 60 * 24 * 30);
            if(monthsDiff <= 3 && qty < 10) return 'border-mix-warn';
            if(monthsDiff <= 3) return 'border-red-warn';
            if(qty < 10) return 'border-yellow-warn';
            return '';
        };

        const saveProduct = () => {
            if(!form.name || form.buyPrice === '' || form.sellPrice === '') return showAlert('အမှား', 'အမည်၊ ဝယ်စျေး၊ ရောင်းစျေး ထည့်ရန် လိုအပ်ပါသည်။');
            const data = { ...form, buyPrice: Number(form.buyPrice), sellPrice: Number(form.sellPrice), qty: Number(form.qty || 0) };
            if(editId) { setInventory(inventory.map(p => p.id === editId ? {...p, ...data} : p)); } 
            else { setInventory([...inventory, { ...data, id: Date.now(), createdAt: Date.now() }]); }
            setIsModalOpen(false); setForm({ name: '', buyPrice: '', sellPrice: '', expDate: '', qty: '' }); setEditId(null);
        };

        const deleteProduct = (id) => {
            const wasSold = sales.some(s => s.cart.some(item => item.id === id));
            let msg = t.confirmDelete;
            if(wasSold) msg = `သတိပြုရန်: ဤကုန်ပစ္စည်းအား ရောင်းချထားသော မှတ်တမ်းများရှိပါသည်။\nဆက်လက်ဖျက်မည်လား?`;
            showConfirm('ဖျက်ရန် အတည်ပြုပါ', msg, () => setInventory(inventory.filter(p => p.id !== id)));
        };

        return (
            <div className="p-4 pb-safe space-y-4">
                <div className="flex gap-2">
                    <input type="text" placeholder={t.search} className={`flex-1 p-3 rounded-xl ${inputClass} outline-none`} value={search} onChange={e=>setSearch(e.target.value)} />
                    <button className={`p-3 px-5 font-bold ${btnClass}`} onClick={() => { setEditId(null); setForm({ name: '', buyPrice: '', sellPrice: '', expDate: '', qty: '' }); setIsModalOpen(true); }}>+</button>
                </div>
                <div className="space-y-3">
                    {filtered.length === 0 && <p className="text-center opacity-50">{t.empty}</p>}
                    {filtered.map(p => (
                        <div key={p.id} className={`p-4 rounded-2xl ${boxClass} ${getWarningClass(p.expDate, p.qty)} flex flex-col gap-2 relative overflow-hidden`}>
                            <div className="flex justify-between items-start z-10">
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{p.name}</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-2 opacity-80">
                                        <div>{t.buyPrice}: {p.buyPrice}</div>
                                        <div>{t.sellPrice}: {p.sellPrice}</div>
                                        <div className={(p.expDate && new Date(p.expDate) - new Date() < 90*24*60*60*1000) ? 'text-[#e57373] font-bold' : ''}>{t.expDate}: {p.expDate || '-'}</div>
                                        <div className={p.qty < 10 ? 'text-yellow-400 font-bold' : ''}>{t.qty}: {p.qty}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 z-10 ml-2">
                                    <button onClick={()=>{setEditId(p.id); setForm(p); setIsModalOpen(true);}} className="text-blue-400 p-2 bg-black/10 rounded-lg"><Icon name="edit-2" className="w-5 h-5" /></button>
                                    <button onClick={()=>deleteProduct(p.id)} className="text-[#e57373] p-2 bg-black/10 rounded-lg"><Icon name="trash-2" className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4">
                        <div className={`w-full max-w-md p-6 rounded-2xl ${boxClass} space-y-4`}>
                            <h2 className="font-bold text-xl">{editId ? t.edit : t.add} {t.product}</h2>
                            <input placeholder={t.name} className={`w-full p-3 rounded-xl ${inputClass}`} value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="number" placeholder={t.buyPrice} className={`w-1/2 p-3 rounded-xl ${inputClass}`} value={form.buyPrice} onChange={e=>setForm({...form, buyPrice: e.target.value})} />
                                <input type="number" placeholder={t.sellPrice} className={`w-1/2 p-3 rounded-xl ${inputClass}`} value={form.sellPrice} onChange={e=>setForm({...form, sellPrice: e.target.value})} />
                            </div>
                            <div className="flex gap-2">
                                <input type="date" placeholder={t.expDate} className={`w-1/2 p-3 rounded-xl ${inputClass}`} value={form.expDate} onChange={e=>setForm({...form, expDate: e.target.value})} />
                                <input type="number" placeholder={t.qty} className={`w-1/2 p-3 rounded-xl ${inputClass}`} value={form.qty} onChange={e=>setForm({...form, qty: e.target.value})} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button className={`flex-1 p-3 font-bold rounded-xl ${btnClass}`} onClick={()=>setIsModalOpen(false)}>{t.cancel}</button>
                                <button className={`flex-1 p-3 font-bold rounded-xl bg-blue-600 text-white shadow-lg`} onClick={saveProduct}>{t.save}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const SaleView = () => {
        const [cart, setCart] = useState([]);
        const [selectedCustomer, setSelectedCustomer] = useState(null);
        const [serviceFee, setServiceFee] = useState(0);
        const [showCustomerSearch, setShowCustomerSearch] = useState(false);
        const [showProductSearch, setShowProductSearch] = useState(false);
        const [cSearchTxt, setCSearchTxt] = useState('');
        const [pSearchTxt, setPSearchTxt] = useState('');
        const [showHistory, setShowHistory] = useState(false);
        const [saleSortBy, setSaleSortBy] = useState('date');

        const cFiltered = customers.filter(c => c.name.toLowerCase().includes(cSearchTxt.toLowerCase()) || c.phone.includes(cSearchTxt));
        const pFiltered = inventory.filter(p => p.name.toLowerCase().includes(pSearchTxt.toLowerCase()) && p.qty > 0);

        const sortedSales = useMemo(() => {
            let res = [...sales];
            if(saleSortBy === 'alpha') res.sort((a,b) => a.customerName.localeCompare(b.customerName));
            else res.sort((a,b) => b.date - a.date);
            return res;
        }, [sales, saleSortBy]);

        const addToCart = (prod) => {
            const existing = cart.find(item => item.id === prod.id);
            if(existing) {
                if(existing.sellQty < prod.qty) { setCart(cart.map(i => i.id === prod.id ? {...i, sellQty: i.sellQty + 1} : i)); } 
                else { showAlert('သတိပေးချက်', 'ကုန်ပစ္စည်း Stock မလောက်တော့ပါ။'); }
            } else { setCart([...cart, { ...prod, sellQty: 1 }]); }
            setShowProductSearch(false);
        };

        const updateCartQty = (id, delta) => {
            setCart(cart.map(item => {
                if(item.id === id) {
                    const currentQty = item.sellQty === '' ? 0 : item.sellQty;
                    const newQty = currentQty + delta;
                    const maxQty = inventory.find(p => p.id === id)?.qty || 0;
                    if(newQty > 0 && newQty <= maxQty) return {...item, sellQty: newQty};
                    if(newQty <= 0) return null;
                }
                return item;
            }).filter(Boolean));
        };

        const setExactCartQty = (id, val) => {
            setCart(cart.map(item => {
                if(item.id === id) {
                    if(val === '') return {...item, sellQty: ''};
                    const num = parseInt(val, 10);
                    if(isNaN(num)) return item;
                    const maxQty = inventory.find(p => p.id === id)?.qty || 0;
                    let finalQty = num;
                    if(finalQty > maxQty) {
                        showAlert('သတိပေးချက်', `Stock မလောက်ပါ။ အများဆုံး ${maxQty} ခုသာ ရနိုင်ပါသည်။`);
                        finalQty = maxQty;
                    }
                    return {...item, sellQty: finalQty};
                }
                return item;
            }));
        };

        const handleQtyBlur = (id, qty) => { if(qty === '' || qty <= 0) { setCart(cart.filter(item => item.id !== id)); } };

        const cartTotal = cart.reduce((sum, item) => sum + (item.sellPrice * (Number(item.sellQty) || 0)), 0);
        const grandTotal = cartTotal + Number(serviceFee || 0);
        const cartProfit = cart.reduce((sum, item) => sum + ((item.sellPrice - item.buyPrice) * (Number(item.sellQty) || 0)), 0);

        const checkout = () => {
            const finalCart = cart.filter(c => c.sellQty > 0);
            if(!selectedCustomer || finalCart.length === 0) return showAlert('အမှား', 'Customer နှင့် ကုန်ပစ္စည်း ရွေးချယ်ပါ။');
            
            const saleRecord = {
                id: Date.now(), customerId: selectedCustomer.id, customerName: selectedCustomer.name,
                cart: [...finalCart], serviceFee: Number(serviceFee || 0), total: grandTotal, profit: cartProfit, date: Date.now()
            };

            let updatedInventory = [...inventory];
            finalCart.forEach(cartItem => {
                const idx = updatedInventory.findIndex(p => p.id === cartItem.id);
                if(idx !== -1) updatedInventory[idx].qty -= cartItem.sellQty;
            });

            setInventory(updatedInventory); setSales([saleRecord, ...sales]);
            setCart([]); setSelectedCustomer(null); setServiceFee(0);
            showConfirm('ရောင်းချမှု အောင်မြင်ပါသည်', 'ဘောင်ချာ (Receipt) ထုတ်လိုပါသလား?', () => { setPrintingSale(saleRecord); }, 'ထုတ်မည်', 'မထုတ်ပါ');
        };

        const deleteSale = (id) => {
            showConfirm('အရောင်းမှတ်တမ်း ဖျက်မည်', 'ဖျက်မည်မှာ သေချာပါသလား?\nအရောင်းမှ ပစ္စည်းအရေအတွက် (Qty) များကို Inventory သို့ ပြန်ပေါင်းထည့်ပါမည်။', () => {
                const sale = sales.find(s => s.id === id);
                if(sale) {
                    let updatedInv = [...inventory];
                    sale.cart.forEach(item => {
                        const idx = updatedInv.findIndex(p => p.id === item.id);
                        if(idx !== -1) updatedInv[idx].qty += item.sellQty;
                    });
                    setInventory(updatedInv);
                }
                setSales(sales.filter(s => s.id !== id));
            });
        };

        if(showHistory) {
            return (
                <div className="p-4 pb-safe space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{t.sale} History</h2>
                        <button className={`p-2 rounded-lg px-4 ${btnClass}`} onClick={()=>setShowHistory(false)}>Back</button>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <button className={`flex-1 p-2 text-sm rounded-lg ${saleSortBy==='alpha'? btnClass : 'opacity-50'}`} onClick={()=>setSaleSortBy('alpha')}>{t.sortAlpha}</button>
                        <button className={`flex-1 p-2 text-sm rounded-lg ${saleSortBy==='date'? btnClass : 'opacity-50'}`} onClick={()=>setSaleSortBy('date')}>{t.sortDate}</button>
                    </div>
                    {sortedSales.length === 0 && <p className="text-center opacity-50">{t.empty}</p>}
                    {sortedSales.map(s => (
                        <div key={s.id} className={`p-4 rounded-xl ${boxClass} space-y-2`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="font-bold text-lg block">{s.customerName}</span>
                                    <span className="text-xs opacity-70">{formatDateTime(s.date)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={()=>setPrintingSale(s)} className="text-blue-400 p-2"><Icon name="printer" className="w-5 h-5" /></button>
                                    <button onClick={()=>deleteSale(s.id)} className="text-[#e57373] p-2"><Icon name="trash-2" className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <div className="text-sm opacity-80 bg-black/10 p-2 rounded-lg mt-2">
                                {s.cart.map((c,i) => <div key={i} className="flex justify-between"><span>{c.name} x {c.sellQty}</span> <span>{c.sellPrice * c.sellQty}</span></div>)}
                                {s.serviceFee > 0 && <div className="flex justify-between text-purple-400 mt-1 border-t border-white/5 pt-1"><span>{t.serviceFee}</span> <span>{s.serviceFee}</span></div>}
                            </div>
                            <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                                <span className="font-bold">{t.total}</span>
                                <span className="font-bold text-green-400 text-lg">{s.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="p-4 pb-safe space-y-4 flex flex-col h-[85vh]">
                <div className="flex justify-between gap-2">
                    <button className={`flex-1 p-4 font-bold flex justify-between items-center ${btnClass}`} onClick={()=>setShowCustomerSearch(true)}>
                        {selectedCustomer ? selectedCustomer.name : t.customer + ' +'}
                        <Icon name="user" className="w-5 h-5" />
                    </button>
                    <button className={`p-4 font-bold flex items-center gap-2 ${btnClass}`} onClick={()=>setShowHistory(true)}>
                        <Icon name="history" className="w-5 h-5" /> History
                    </button>
                </div>
                <div className={`flex-1 overflow-y-auto rounded-2xl p-4 ${boxClass} space-y-3`}>
                    {cart.length === 0 && <div className="h-full flex items-center justify-center opacity-50">{t.empty}</div>}
                    {cart.map(item => (
                        <div key={item.id} className={`p-3 rounded-xl bg-black/10 flex justify-between items-center`}>
                            <div className="flex-1">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-sm opacity-70">{item.sellPrice} x {(item.sellQty || 0)} = {item.sellPrice * (item.sellQty || 0)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={()=>updateCartQty(item.id, -1)} className={`w-8 h-8 rounded-full ${btnClass} flex items-center justify-center font-bold text-lg`}>-</button>
                                <input type="number" className={`w-14 text-center p-1 font-bold rounded-lg outline-none border border-white/20 ${inputClass}`} value={item.sellQty} onChange={(e) => setExactCartQty(item.id, e.target.value)} onBlur={(e) => handleQtyBlur(item.id, item.sellQty)} />
                                <button onClick={()=>updateCartQty(item.id, 1)} className={`w-8 h-8 rounded-full ${btnClass} flex items-center justify-center font-bold text-lg`}>+</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className={`p-4 font-bold flex justify-center gap-2 ${btnClass}`} onClick={()=>setShowProductSearch(true)}>
                    <Icon name="plus-circle" className="w-5 h-5" /> {t.product}
                </button>
                <div className={`p-5 rounded-2xl ${boxClass} space-y-3`}>
                    <div className="flex justify-between items-center">
                        <span className="font-bold">{t.serviceFee}</span>
                        <input type="number" className={`w-32 p-3 rounded-xl text-right ${inputClass}`} value={serviceFee} onChange={e=>setServiceFee(e.target.value)} />
                    </div>
                    <div className="flex justify-between items-center font-bold text-2xl py-3 border-t border-white/10">
                        <span>{t.total}</span>
                        <span className="text-blue-400">{grandTotal}</span>
                    </div>
                    <button className={`w-full p-4 font-bold rounded-xl bg-green-600 text-white shadow-lg text-lg`} onClick={checkout}>{t.checkout}</button>
                </div>

                {showCustomerSearch && (
                    <div className="fixed inset-0 z-50 modal-overlay flex flex-col p-4 pt-10">
                        <div className={`w-full flex-1 rounded-2xl flex flex-col overflow-hidden ${boxClass}`}>
                            <div className="p-4 border-b border-white/10 flex gap-2">
                                <input autoFocus placeholder={t.search} className={`flex-1 p-3 rounded-xl ${inputClass}`} value={cSearchTxt} onChange={e=>setCSearchTxt(e.target.value)} />
                                <button className={`p-3 px-5 font-bold rounded-xl ${btnClass}`} onClick={()=>setShowCustomerSearch(false)}>X</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {cFiltered.map(c => (
                                    <div key={c.id} className={`p-4 rounded-xl ${btnClass}`} onClick={()=>{setSelectedCustomer(c); setShowCustomerSearch(false);}}>
                                        <div className="font-bold text-lg">{c.name}</div>
                                        <div className="text-sm opacity-70">{c.phone}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {showProductSearch && (
                    <div className="fixed inset-0 z-50 modal-overlay flex flex-col p-4 pt-10">
                        <div className={`w-full flex-1 rounded-2xl flex flex-col overflow-hidden ${boxClass}`}>
                            <div className="p-4 border-b border-white/10 flex gap-2">
                                <input autoFocus placeholder={t.search} className={`flex-1 p-3 rounded-xl ${inputClass}`} value={pSearchTxt} onChange={e=>setPSearchTxt(e.target.value)} />
                                <button className={`p-3 px-5 font-bold rounded-xl ${btnClass}`} onClick={()=>setShowProductSearch(false)}>X</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {pFiltered.map(p => (
                                    <div key={p.id} className={`p-4 rounded-xl flex justify-between items-center ${btnClass}`} onClick={()=>addToCart(p)}>
                                        <div>
                                            <div className="font-bold text-lg">{p.name}</div>
                                            <div className="text-sm opacity-70 mt-1">{t.qty}: <span className="font-bold text-yellow-400">{p.qty}</span> | {p.sellPrice}</div>
                                        </div>
                                        <Icon name="plus" className="text-green-400 w-6 h-6" />
                                    </div>
                                ))}
                                {pFiltered.length === 0 && <div className="text-center mt-10 opacity-50">{t.empty} / Out of stock</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const ExpenseView = () => {
        const [form, setForm] = useState({ amount: '', type: 'profit', note: '' });
        const saveExpense = () => {
            if(!form.amount) return showAlert('အမှား', 'ပမာဏ ထည့်သွင်းရန် လိုအပ်ပါသည်။');
            setExpenses([{ ...form, amount: Number(form.amount), id: Date.now(), date: Date.now() }, ...expenses]);
            setForm({ amount: '', type: 'profit', note: '' });
        };
        const deleteExp = (id) => showConfirm('အသုံးစရိတ် ဖျက်မည်', 'ဖျက်မည်မှာ သေချာပါသလား?', () => setExpenses(expenses.filter(e => e.id !== id)));

        return (
            <div className="p-4 pb-safe space-y-4">
                <div className={`p-6 rounded-2xl ${boxClass} space-y-4`}>
                    <h2 className="font-bold text-xl">{t.expense}</h2>
                    <input type="number" placeholder={t.amount} className={`w-full p-4 rounded-xl ${inputClass}`} value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} />
                    <input placeholder="Note (မှတ်ချက်)" className={`w-full p-4 rounded-xl ${inputClass}`} value={form.note} onChange={e=>setForm({...form, note: e.target.value})} />
                    <div>
                        <label className="block mb-2 font-bold opacity-80">{t.deductFrom}:</label>
                        <select className={`w-full p-4 rounded-xl ${inputClass}`} value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                            <option value="profit">{t.profit} (Profit)</option>
                            <option value="service">{t.serviceFee} (Service Fee)</option>
                        </select>
                    </div>
                    <button className={`w-full p-4 font-bold rounded-xl bg-[#e57373] text-white shadow-lg text-lg`} onClick={saveExpense}>{t.save}</button>
                </div>
                <div className="space-y-3 mt-6">
                    {expenses.map(e => (
                        <div key={e.id} className={`p-4 rounded-xl ${boxClass} flex justify-between items-center`}>
                            <div>
                                <div className="font-bold text-[#e57373] text-lg">- {e.amount}</div>
                                <div className="text-sm opacity-70">{e.note} <span className="opacity-50 text-xs">({e.type})</span></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs opacity-50">{formatDateOnly(e.date)}</span>
                                <button onClick={()=>deleteExp(e.id)} className="text-[#e57373] p-2"><Icon name="trash-2" className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const DashboardView = () => {
        if(currentUser?.role !== 'admin') return <div className="p-10 text-center opacity-50">Access Denied</div>;
        const [period, setPeriod] = useState('allTime');

        const filteredSales = useMemo(() => {
            const now = new Date();
            return sales.filter(s => {
                const sDate = new Date(s.date);
                if(period === 'daily') return sDate.toDateString() === now.toDateString();
                if(period === 'monthly') return sDate.getMonth() === now.getMonth() && sDate.getFullYear() === now.getFullYear();
                if(period === 'yearly') return sDate.getFullYear() === now.getFullYear();
                return true;
            });
        }, [sales, period]);

        const filteredExpenses = useMemo(() => {
            const now = new Date();
            return expenses.filter(e => {
                const eDate = new Date(e.date);
                if(period === 'daily') return eDate.toDateString() === now.toDateString();
                if(period === 'monthly') return eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear();
                if(period === 'yearly') return eDate.getFullYear() === now.getFullYear();
                return true;
            });
        }, [expenses, period]);

        const stats = useMemo(() => {
            let totalSale = 0, totalProfit = 0, totalService = 0;
            filteredSales.forEach(s => { totalSale += s.total; totalProfit += s.profit; totalService += s.serviceFee; });
            filteredExpenses.forEach(e => { if(e.type === 'profit') totalProfit -= e.amount; if(e.type === 'service') totalService -= e.amount; });
            const stockValue = inventory.reduce((sum, p) => sum + (p.buyPrice * p.qty), 0);
            let pMap = {};
            filteredSales.forEach(s => s.cart.forEach(c => { pMap[c.name] = (pMap[c.name] || 0) + c.sellQty; }));
            const top20 = Object.entries(pMap).sort((a,b) => b[1] - a[1]).slice(0, 20);
            return { totalSale, totalProfit, totalService, stockValue, top20 };
        }, [filteredSales, filteredExpenses, inventory]);

        return (
            <div className="p-4 pb-safe space-y-4">
                <select className={`w-full p-4 mb-4 rounded-xl font-bold text-lg ${inputClass}`} value={period} onChange={e=>setPeriod(e.target.value)}>
                    <option value="daily">{t.daily}</option>
                    <option value="monthly">{t.monthly}</option>
                    <option value="yearly">{t.yearly}</option>
                    <option value="allTime">{t.allTime}</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl ${boxClass} flex flex-col items-center justify-center text-center`}>
                        <div className="text-sm opacity-70 mb-2 font-bold">{t.total} {t.sale}</div>
                        <div className="text-2xl font-bold text-blue-400">{stats.totalSale}</div>
                    </div>
                    <div className={`p-5 rounded-2xl ${boxClass} flex flex-col items-center justify-center text-center`}>
                        <div className="text-sm opacity-70 mb-2 font-bold">Net {t.profit}</div>
                        <div className="text-2xl font-bold text-green-400">{stats.totalProfit}</div>
                    </div>
                    <div className={`p-5 rounded-2xl ${boxClass} flex flex-col items-center justify-center text-center`}>
                        <div className="text-sm opacity-70 mb-2 font-bold">{t.serviceFee}</div>
                        <div className="text-2xl font-bold text-purple-400">{stats.totalService}</div>
                    </div>
                    <div className={`p-5 rounded-2xl ${boxClass} flex flex-col items-center justify-center text-center`}>
                        <div className="text-sm opacity-70 mb-2 font-bold">{t.stockValue}</div>
                        <div className="text-2xl font-bold text-yellow-400">{stats.stockValue}</div>
                    </div>
                </div>
                <div className={`mt-6 p-5 rounded-2xl ${boxClass}`}>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Icon name="award" className="text-yellow-400 w-5 h-5" /> {t.top20}</h3>
                    <div className="space-y-3">
                        {stats.top20.length === 0 && <p className="opacity-50 text-center">{t.empty}</p>}
                        {stats.top20.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-black/10">
                                <span className="flex items-center gap-3"><span className="opacity-50 font-bold w-4">{idx+1}.</span> <span className="font-bold">{item[0]}</span></span>
                                <span className="font-bold text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">{item[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const SettingsView = () => {
        const [showUserManage, setShowUserManage] = useState(false);
        const [newStaffName, setNewStaffName] = useState('');
        const [newStaffPass, setNewStaffPass] = useState('');

        const handleBackup = () => {
            try {
                const data = { customers, inventory, sales, expenses, users };
                const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `luna_pos_backup_${Date.now()}.json`; 
                document.body.appendChild(a); // App Crash fix for mobile
                a.click();
                setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
            } catch (err) { showAlert('အမှား', 'Backup ယူရာတွင် Error ရှိနေပါသည်။'); }
        };
        
        const handleRestore = (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if(data.customers && data.inventory) {
                        setCustomers(data.customers); setInventory(data.inventory);
                        setSales(data.sales || []); setExpenses(data.expenses || []);
                        if(data.users) setUsers(data.users);
                        showAlert('အောင်မြင်ပါသည်', "Data များကို အောင်မြင်စွာ ပြန်လည်ရယူပြီးပါပြီ (Restore Successful)။");
                    } else showAlert('အမှား', "ဖိုင်အမျိုးအစား မှားယွင်းနေပါသည်။ (Invalid Backup File)");
                } catch(err) { showAlert('အမှား', "ဖိုင်ကို ဖတ်၍မရပါ။"); }
            };
            reader.readAsText(file);
        };

        const handleLogout = () => { showConfirm('ထွက်ရန်', 'အကောင့်မှ ထွက်မည်မှာ သေချာပါသလား?', () => setCurrentUser(null), t.logout, t.cancel); };

        const handleAddStaff = () => {
            if(!newStaffName || !newStaffPass) return showAlert('အမှား', 'အမည် နှင့် စကားဝှက် ထည့်ပါ။');
            if(users.some(u => u.name === newStaffName)) return showAlert('အမှား', 'ဤအမည်ဖြင့် အကောင့်ရှိပြီးသားဖြစ်ပါသည်။');
            setUsers([...users, { id: Date.now(), name: newStaffName, password: newStaffPass, role: 'staff' }]);
            setNewStaffName(''); setNewStaffPass('');
            showAlert('အောင်မြင်ပါသည်', 'Staff အကောင့် ဖန်တီးပြီးပါပြီ။');
        };

        const handleDeleteUser = (id, role) => {
            if(role === 'admin') return showAlert('အမှား', 'Admin အကောင့်ကို ဖျက်၍မရပါ။');
            showConfirm('အကောင့်ဖျက်မည်', 'ဤဝန်ထမ်းအကောင့်ကို ဖျက်မည်မှာ သေချာပါသလား?', () => { setUsers(users.filter(u => u.id !== id)); });
        };

        if(showUserManage) {
            return (
                <div className="p-4 pb-safe space-y-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{t.manageUsers}</h2>
                        <button className={`p-2 rounded-lg px-4 ${btnClass}`} onClick={()=>setShowUserManage(false)}>Back</button>
                    </div>
                    <div className={`p-6 rounded-2xl ${boxClass} space-y-4`}>
                        <h3 className="font-bold">Staff အသစ်ဖန်တီးရန်</h3>
                        <input type="text" placeholder={t.username} className={`w-full p-3 rounded-xl ${inputClass}`} value={newStaffName} onChange={e=>setNewStaffName(e.target.value)} />
                        <input type="text" placeholder={t.password} className={`w-full p-3 rounded-xl ${inputClass}`} value={newStaffPass} onChange={e=>setNewStaffPass(e.target.value)} />
                        <button className={`w-full p-3 font-bold rounded-xl bg-blue-600 text-white shadow-lg`} onClick={handleAddStaff}>{t.add}</button>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold text-lg mt-6">အကောင့်စာရင်း</h3>
                        {users.map(u => (
                            <div key={u.id} className={`p-4 rounded-xl ${boxClass} flex justify-between items-center`}>
                                <div>
                                    <div className="font-bold text-lg">{u.name}</div>
                                    <div className={`text-sm ${u.role === 'admin' ? 'text-blue-400' : 'text-green-400'}`}>{u.role.toUpperCase()}</div>
                                </div>
                                {u.role !== 'admin' && <button onClick={()=>handleDeleteUser(u.id, u.role)} className="text-[#e57373] p-2"><Icon name="trash-2" className="w-5 h-5" /></button>}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4 pb-safe space-y-6">
                <div className={`p-6 rounded-2xl ${boxClass} flex justify-between items-center`}>
                    <div>
                        <div className="text-sm opacity-70">အကောင့်အမည်</div>
                        <div className="font-bold text-xl text-blue-400">{currentUser?.name} <span className="text-sm opacity-50">({currentUser?.role})</span></div>
                    </div>
                    <button className="p-3 bg-[#e57373] text-white rounded-xl font-bold shadow-lg" onClick={handleLogout}><Icon name="log-out" className="w-5 h-5" /></button>
                </div>
                {currentUser?.role === 'admin' && (
                    <button className={`w-full p-4 font-bold rounded-xl flex justify-between items-center ${btnClass}`} onClick={()=>setShowUserManage(true)}>
                        <span className="flex items-center gap-2"><Icon name="users" className="w-5 h-5" /> {t.manageUsers}</span>
                        <Icon name="chevron-right" className="w-5 h-5" />
                    </button>
                )}
                <div className={`p-6 rounded-2xl ${boxClass} space-y-4`}>
                    <h3 className="font-bold text-lg">{t.shopName} (ဆိုင်အမည်)</h3>
                    <input type="text" className={`w-full p-4 rounded-xl font-bold ${inputClass}`} value={shopName} onChange={e=>setShopName(e.target.value)} placeholder="Enter Shop Name" />
                </div>
                <div className={`p-6 rounded-2xl ${boxClass} space-y-4`}>
                    <h3 className="font-bold text-lg">{t.lang}</h3>
                    <div className="flex gap-3">
                        <button className={`flex-1 p-4 font-bold rounded-xl ${lang==='mm'? 'bg-blue-600 text-white' : btnClass}`} onClick={()=>setLang('mm')}>မြန်မာ</button>
                        <button className={`flex-1 p-4 font-bold rounded-xl ${lang==='en'? 'bg-blue-600 text-white' : btnClass}`} onClick={()=>setLang('en')}>English</button>
                    </div>
                </div>
                <div className={`p-6 rounded-2xl ${boxClass} space-y-4`}>
                    <h3 className="font-bold text-lg">{t.theme}</h3>
                    <div className="flex gap-3">
                        <button className={`flex-1 p-4 font-bold rounded-xl flex items-center justify-center gap-2 ${theme==='dark'? 'bg-blue-600 text-white' : btnClass}`} onClick={()=>setTheme('dark')}><Icon name="moon" className="w-5 h-5" /> Dark</button>
                        <button className={`flex-1 p-4 font-bold rounded-xl flex items-center justify-center gap-2 ${theme==='light'? 'bg-blue-600 text-white' : btnClass}`} onClick={()=>setTheme('light')}><Icon name="sun" className="w-5 h-5" /> Light</button>
                    </div>
                </div>
                {currentUser?.role === 'admin' && (
                    <div className={`p-6 rounded-2xl ${boxClass} space-y-4`}>
                        <h3 className="font-bold text-lg flex items-center gap-2"><Icon name="database" className="w-5 h-5" /> Data Management</h3>
                        <button className={`w-full p-4 font-bold rounded-xl flex justify-center gap-2 ${btnClass}`} onClick={handleBackup}><Icon name="download" className="w-5 h-5" /> {t.backup} (.json)</button>
                        <label className={`w-full p-4 font-bold rounded-xl flex justify-center gap-2 cursor-pointer ${btnClass}`}>
                            <Icon name="upload" className="w-5 h-5" /> {t.restore}
                            <input type="file" accept=".json" className="hidden" onChange={handleRestore} />
                        </label>
                        <p className="text-sm text-center opacity-60 mt-2 p-2 bg-black/10 rounded-lg">Backup file ကို တခြားဖုန်းသို့ ပို့၍ Restore ပြန်လုပ်နိုင်ပါသည်။</p>
                    </div>
                )}
            </div>
        );
    };

    if (!currentUser) return <div className="max-w-md mx-auto relative min-h-screen pt-10 text-center"><h1 className="luna-title">LUNA POS</h1><AuthView /></div>;

    return (
        <div className="max-w-md mx-auto relative min-h-screen flex flex-col">
            <DrawerNav />
            {dialog.isOpen && (
                <div className="fixed inset-0 z-[300] modal-overlay flex items-center justify-center p-4">
                    <div className={`w-full max-w-sm p-6 rounded-3xl ${boxClass} space-y-4`}>
                        <h3 className={`font-bold text-xl ${dialog.type === 'alert' ? 'text-blue-400' : 'text-[#e57373]'}`}>{dialog.title}</h3>
                        <p className="whitespace-pre-line text-md opacity-90 leading-relaxed">{dialog.message}</p>
                        <div className="flex gap-3 pt-4">
                            <button className={`flex-1 p-4 font-bold rounded-xl ${btnClass}`} onClick={closeDialog}>{dialog.type === 'confirm' ? dialog.cancelText : 'OK'}</button>
                            {dialog.type === 'confirm' && (
                                <button className={`flex-1 p-4 font-bold rounded-xl text-white shadow-lg bg-blue-600`} onClick={() => { if(dialog.onConfirm) dialog.onConfirm(); closeDialog(); }}>{dialog.confirmText}</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {printingSale && (
                <div className="fixed inset-0 z-[200] bg-white text-black overflow-y-auto print:static print:w-full print:h-auto print:overflow-visible">
                    <div className="max-w-[80mm] mx-auto p-4 pb-20 bg-white" style={{color: 'black'}}>
                        <h2 className="text-center font-bold text-xl mb-1 text-black">{shopName}</h2>
                        <div className="text-center text-xs mb-4 border-b border-black pb-2 text-black">Date: {formatDateTime(printingSale.date)}</div>
                        <div className="text-sm mb-3 font-bold text-black">Customer: {printingSale.customerName}</div>
                        <table className="w-full text-sm mb-3 text-black">
                            <thead>
                                <tr className="border-b border-black text-left">
                                    <th className="py-1 text-black">Item</th><th className="py-1 text-center text-black">Qty</th><th className="py-1 text-right text-black">Amt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {printingSale.cart.map((c, i) => (
                                    <tr key={i} className="border-b border-dashed border-gray-400">
                                        <td className="py-2 pr-1 text-black">{c.name} <br/><span className="text-xs text-gray-700">@{c.sellPrice}</span></td>
                                        <td className="py-2 text-center align-top text-black">{c.sellQty}</td>
                                        <td className="py-2 text-right align-top text-black">{c.sellPrice * c.sellQty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {printingSale.serviceFee > 0 && <div className="flex justify-between text-sm mb-1 text-black"><span>{t.serviceFee}:</span><span>{printingSale.serviceFee}</span></div>}
                        <div className="flex justify-between font-bold text-lg border-t border-black pt-2 mb-6 text-black"><span>Total:</span><span>{printingSale.total}</span></div>
                        <div className="text-center font-bold text-sm text-black">~ ကျေးဇူးတင်ပါသည် ~</div><div className="text-center text-xs mt-1 text-black">Thank You</div>
                        <div className="no-print flex gap-2 mt-10">
                            <button className="flex-1 p-3 bg-gray-500 text-white rounded-xl font-bold shadow-lg" onClick={() => setPrintingSale(null)}>Back</button>
                            <button className="flex-1 p-3 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg" onClick={() => window.print()}><Icon name="printer" className="w-5 h-5" /> Print</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={printingSale ? "hidden" : "flex flex-col flex-1"}>
                <div className="pt-4 pb-2 px-4 sticky top-0 z-30 backdrop-blur-md bg-transparent flex justify-between items-center border-b border-white/5 shadow-sm">
                    <button onClick={() => setIsDrawerOpen(true)} className={`p-2 rounded-xl ${btnClass}`}><Icon name="menu" className="w-6 h-6" /></button>
                    <h1 className="luna-title text-xl">{activeTab.toUpperCase()}</h1>
                    <div className="w-10"></div>
                </div>

                <div className="animate-fade-in flex-1">
                    {activeTab === 'dashboard' && <DashboardView />}
                    {activeTab === 'customer' && <CustomerView />}
                    {activeTab === 'purchase' && <PurchaseView />}
                    {activeTab === 'sale' && <SaleView />}
                    {activeTab === 'expense' && <ExpenseView />}
                    {activeTab === 'settings' && <SettingsView />}
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
