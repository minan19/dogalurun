export type OrderStatus = "preparing" | "shipped" | "delivered" | "cancelled";
export type CargoCompany = "aras" | "yurtici" | "mng" | "ptt" | "surat" | "";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  dateISO: string; // yyyy-mm-dd
  date: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  city: string;
  address: string;
  cargoCompany: CargoCompany;
  trackingNo: string;
  notifiedWarehouse: boolean;
}

export const mockOrders: Order[] = [
  {
    id: "HS-2026-10841", customer: "Ayşe Kaya",     email: "ayse@mail.com",    phone: "0532 111 2233",
    dateISO: "2026-03-20", date: "20 Mar 2026",
    items: [{ name: "Omega-3 1000mg", qty: 2, price: 279 }, { name: "D Vitamini", qty: 1, price: 276 }],
    total: 834,  status: "preparing", city: "İstanbul", address: "Bağcılar Mah. Gül Sok. No:12 D:4",
    cargoCompany: "", trackingNo: "", notifiedWarehouse: false,
  },
  {
    id: "HS-2026-10840", customer: "Mehmet Yılmaz", email: "mehmet@mail.com",  phone: "0541 222 3344",
    dateISO: "2026-03-20", date: "20 Mar 2026",
    items: [{ name: "Magnezyum B6", qty: 1, price: 289 }],
    total: 289,  status: "shipped", city: "Ankara", address: "Çankaya Mah. Atatürk Cad. No:45",
    cargoCompany: "aras", trackingNo: "ARS2026334455", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10839", customer: "Fatma Demir",   email: "fatma@mail.com",   phone: "0555 333 4455",
    dateISO: "2026-03-19", date: "19 Mar 2026",
    items: [{ name: "Probiyotik", qty: 1, price: 259 }, { name: "Çinko", qty: 1, price: 285 }],
    total: 544,  status: "delivered", city: "İzmir", address: "Konak Mah. Fevzipaşa Blv. No:88",
    cargoCompany: "yurtici", trackingNo: "YK2026778899", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10838", customer: "Ali Çelik",     email: "ali@mail.com",     phone: "0537 444 5566",
    dateISO: "2026-03-19", date: "19 Mar 2026",
    items: [{ name: "Multivitamin", qty: 2, price: 312 }, { name: "B12", qty: 1, price: 195 }, { name: "Kefir", qty: 1, price: 429 }],
    total: 1248, status: "delivered", city: "Bursa", address: "Nilüfer Mah. Cumhuriyet Cad. No:7",
    cargoCompany: "mng", trackingNo: "MNG2026556677", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10837", customer: "Zeynep Arslan", email: "zeynep@mail.com",  phone: "0545 555 6677",
    dateISO: "2026-03-18", date: "18 Mar 2026",
    items: [{ name: "Spirulina", qty: 1, price: 399 }],
    total: 399,  status: "cancelled", city: "Antalya", address: "Muratpaşa Mah. Işıklar Cad. No:3",
    cargoCompany: "", trackingNo: "", notifiedWarehouse: false,
  },
  {
    id: "HS-2026-10836", customer: "Hasan Şahin",   email: "hasan@mail.com",   phone: "0532 666 7788",
    dateISO: "2026-03-18", date: "18 Mar 2026",
    items: [{ name: "Kolajen", qty: 1, price: 329 }, { name: "Hyalüronik Asit", qty: 1, price: 309 }],
    total: 638,  status: "delivered", city: "Adana", address: "Seyhan Mah. İnönü Cad. No:55",
    cargoCompany: "surat", trackingNo: "SRT2026112233", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10835", customer: "Elif Yıldız",   email: "elif@mail.com",    phone: "0541 777 8899",
    dateISO: "2026-03-17", date: "17 Mar 2026",
    items: [{ name: "Ashwagandha", qty: 1, price: 179 }],
    total: 179,  status: "shipped", city: "Kocaeli", address: "İzmit Mah. Cumhuriyet Meydanı No:2",
    cargoCompany: "ptt", trackingNo: "PTT2026998877", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10834", customer: "Mustafa Öz",    email: "mustafa@mail.com", phone: "0538 888 9900",
    dateISO: "2026-03-17", date: "17 Mar 2026",
    items: [{ name: "Omega-3 1000mg", qty: 2, price: 279 }, { name: "D Vitamini", qty: 1, price: 276 }, { name: "Multivitamin", qty: 2, price: 312 }],
    total: 1595, status: "preparing", city: "Gaziantep", address: "Şehitkamil Mah. Suburcu Cad. No:18",
    cargoCompany: "", trackingNo: "", notifiedWarehouse: false,
  },
  // Eski siparişler — dönem filtresi için
  {
    id: "HS-2026-10820", customer: "Selma Kurt",    email: "selma@mail.com",   phone: "0533 100 2200",
    dateISO: "2026-02-28", date: "28 Şub 2026",
    items: [{ name: "C Vitamini", qty: 2, price: 159 }],
    total: 318,  status: "delivered", city: "İzmir", address: "Karşıyaka Mah. No:5",
    cargoCompany: "yurtici", trackingNo: "YK2026001122", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10810", customer: "Tarık Boz",     email: "tarik@mail.com",   phone: "0542 300 4400",
    dateISO: "2026-02-15", date: "15 Şub 2026",
    items: [{ name: "Magnezyum", qty: 1, price: 199 }],
    total: 199,  status: "delivered", city: "Ankara", address: "Keçiören No:22",
    cargoCompany: "aras", trackingNo: "ARS2026223344", notifiedWarehouse: true,
  },
  {
    id: "HS-2026-10790", customer: "Melike Aydın",  email: "melike@mail.com",  phone: "0545 500 6600",
    dateISO: "2026-01-20", date: "20 Oca 2026",
    items: [{ name: "Omega-3", qty: 1, price: 345 }, { name: "D3K2", qty: 1, price: 289 }],
    total: 634,  status: "cancelled", city: "İstanbul", address: "Şişli No:8",
    cargoCompany: "", trackingNo: "", notifiedWarehouse: false,
  },
];

// Gerçek sipariş verisi gelince buradan değiştir
export const TODAY = new Date(2026, 2, 21); // 2026-03-21

export function parseDateISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function filterByPeriod(orders: Order[], period: string): Order[] {
  if (period === "all") return orders;
  const days = parseInt(period);
  return orders.filter(o => {
    const diff = (TODAY.getTime() - parseDateISO(o.dateISO).getTime()) / 86400000;
    return diff <= days;
  });
}
