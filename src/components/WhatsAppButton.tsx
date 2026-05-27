"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "905001234567"; // değiştirilecek

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  const messages = [
    { label: "Ürün hakkında bilgi almak istiyorum", msg: "Merhaba, bir ürün hakkında bilgi almak istiyorum." },
    { label: "Siparişimi takip etmek istiyorum",    msg: "Merhaba, siparişimi takip etmek istiyorum." },
    { label: "İade / değişim yapmak istiyorum",     msg: "Merhaba, iade veya değişim yapmak istiyorum." },
    { label: "Genel soru sormak istiyorum",          msg: "Merhaba, size bir sorum var." },
  ];

  function openChat(msg: string) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setOpen(false);
  }

  return (
    <>
      {/* Popup menü */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-24 right-5 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-olive-border/30 overflow-hidden">
            {/* Başlık */}
            <div className="bg-[#25D366] px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.532 5.856L0 24l6.335-1.611A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.641-.519-5.145-1.42l-.368-.219-3.766.958.999-3.668-.24-.38A9.946 9.946 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Hüda-i Şifa Destek</p>
                <p className="text-white/80 text-[11px]">Genellikle birkaç dakikada yanıt verir</p>
              </div>
            </div>

            {/* Mesaj seçenekleri */}
            <div className="p-3 flex flex-col gap-2">
              <p className="text-[11px] text-text-secondary px-1 mb-1">Konuyu seçin:</p>
              {messages.map((m) => (
                <button
                  key={m.label}
                  onClick={() => openChat(m.msg)}
                  className="text-left text-xs text-green-900 bg-[#EAF0DC] hover:bg-green-100 px-3 py-2.5 rounded-xl transition-colors font-medium border border-olive-border/20"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Ana buton */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        aria-label="WhatsApp ile iletişim"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.532 5.856L0 24l6.335-1.611A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.641-.519-5.145-1.42l-.368-.219-3.766.958.999-3.668-.24-.38A9.946 9.946 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
        </svg>
        {/* Pulse animasyonu */}
        <span className="absolute w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </button>
    </>
  );
}
