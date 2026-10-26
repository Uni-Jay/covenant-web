import { useEffect, useMemo, useState } from 'react';
import { FaDownload, FaRandom, FaWhatsapp, FaCopy } from 'react-icons/fa';
import { Card, cardBlob, makeCard } from './cards';
import { Member, nameOf, waLink } from './lib';
import { Btn, Loading, Modal } from './ui';

export const greeting = (m: Member, kind: 'bday' | 'anniv') => kind === 'bday'
  ? `Happy birthday ${m.title ? m.title + ' ' : ''}${m.first_name}! 🎉🎂 Your church family at Household Of Covenant And Faith celebrates you today. May this new year bring you God’s favour, good health and joy. We love you! ❤️`
  : `Happy wedding anniversary ${m.title ? m.title + ' ' : ''}${m.first_name}${m.spouse_name ? ' and ' + m.spouse_name : ''}! 💍 May God keep your home in love, peace and joy. Your church family celebrates with you. ❤️`;

const isPhone = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/** A birthday or anniversary card for one member, ready to send on WhatsApp */
export default function CardModal({ m, kind, onClose }: { m: Member; kind: 'bday' | 'anniv'; onClose: () => void }) {
  const [variant, setVariant] = useState(0);
  const [card, setCard] = useState<Card | null>(null);
  const [url, setUrl] = useState('');
  const [hint, setHint] = useState('');
  const text = greeting(m, kind);
  const wa = waLink(m.phone, text);
  const person = useMemo(() => ({
    id: m.id, name: nameOf(m), spouse: m.spouse_name, day: m.birth_day, month: m.birth_month, annDay: m.ann_day, annMonth: m.ann_month, photo: m.photo_url,
  }), [m]);

  useEffect(() => {
    let live = true; setCard(null); setHint('');
    makeCard(person, kind, variant).then((c) => { if (!live) return; setCard(c); setUrl(c.canvas.toDataURL('image/jpeg', 0.9)); });
    return () => { live = false; };
  }, [person, kind, variant]);

  const fileName = `${kind === 'bday' ? 'Birthday' : 'Anniversary'} card - ${nameOf(m)}.jpg`;
  const download = async () => {
    if (!card) return;
    const b = await cardBlob(card); const u = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = u; a.download = fileName; a.click(); setTimeout(() => URL.revokeObjectURL(u), 2000);
  };
  // phone: share the picture straight into WhatsApp (with the message)
  const share = async () => {
    if (!card) return;
    try {
      const file = new File([await cardBlob(card)], fileName, { type: 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
    } catch (e: any) { if (e?.name === 'AbortError') return; }
    await download(); if (wa) window.open(wa, '_blank');
    setHint('The card is saved on this phone. In WhatsApp, attach it from your gallery.');
  };
  // computer: copy the picture, open their chat, then paste (Ctrl+V)
  const copyAndOpen = async () => {
    if (!card) return;
    try {
      const png = await new Promise<Blob>((res, rej) => card.canvas.toBlob((b) => (b ? res(b) : rej(new Error('x'))), 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
      if (wa) window.open(wa, '_blank');
      setHint(wa ? 'The card is copied. In the WhatsApp chat that opened, press Ctrl+V to paste it, then Send.' : 'The card is copied. Paste it (Ctrl+V) into any chat.');
    } catch (e) {
      await download(); if (wa) window.open(wa, '_blank');
      setHint('The card was downloaded. In the WhatsApp chat that opened, attach it with the 📎 button.');
    }
  };

  return (
    <Modal open title={`${kind === 'bday' ? 'Birthday' : 'Anniversary'} card for ${nameOf(m)}`} onClose={onClose} wide
      footer={<>
        <Btn kind="ghost" onClick={() => setVariant(variant + 1)} disabled={!card}><FaRandom /> Another design</Btn>
        <Btn kind="ghost" onClick={download} disabled={!card}><FaDownload /> Download</Btn>
        {isPhone()
          ? <Btn className="bg-emerald-600 hover:bg-emerald-700" onClick={share} disabled={!card}><FaWhatsapp /> Send on WhatsApp</Btn>
          : <Btn className="bg-emerald-600 hover:bg-emerald-700" onClick={copyAndOpen} disabled={!card}>{wa ? <><FaWhatsapp /> Copy card &amp; open WhatsApp</> : <><FaCopy /> Copy card</>}</Btn>}
      </>}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,340px)_1fr] md:items-start">
        <div className="mx-auto w-full max-w-[340px]">
          {card ? <img src={url} alt="" className="w-full rounded-xl shadow-lg" /> : <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-gray-100"><Loading text="Making the card…" /></div>}
          {card && <p className="mt-2 text-center text-xs text-gray-500">{card.design} design</p>}
        </div>
        <div className="text-[15px]">
          <p className="mb-1 font-semibold">Message that goes with it</p>
          <p className="rounded-xl bg-gray-50 p-3 text-gray-700">{text}</p>
          {!m.photo_url && <p className="mt-3 rounded-lg bg-secondary-50 p-3 text-sm text-secondary-900">No photo yet. Add one on their profile (or they can use “Update my photo” on the Church Studio birthday form) and the card will show it.</p>}
          {!wa && <p className="mt-3 text-sm text-gray-600">There’s no phone number for {m.first_name}, so download the card and send it yourself.</p>}
          {hint && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{hint}</p>}
          <p className="mt-3 text-sm text-gray-500">The same designs as Church Studio. Press “Another design” for a different look, colours and words.</p>
        </div>
      </div>
    </Modal>
  );
}

export function useCard() {
  const [open, setOpen] = useState<{ m: Member; kind: 'bday' | 'anniv' } | null>(null);
  const node = open ? <CardModal m={open.m} kind={open.kind} onClose={() => setOpen(null)} /> : null;
  return { openCard: (m: Member, kind: 'bday' | 'anniv') => setOpen({ m, kind }), cardNode: node };
}
