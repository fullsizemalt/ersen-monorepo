import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Star } from 'lucide-react';

const MOCK_REVIEWS = [
    { title: 'Dune: Part Two', rating: 5, user: 'davidehrlich', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=100&h=150&q=80' },
    { title: 'Poor Things', rating: 4.5, user: 'karsten', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=150&q=80' },
    { title: 'Oppenheimer', rating: 5, user: 'demi', img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=100&h=150&q=80' },
    { title: 'Barbie', rating: 4, user: 'zoe', img: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=100&h=150&q=80' },
];

const LetterboxdWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full flex flex-col bg-[#14181c] text-white p-3">
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-[#40bcf4] uppercase tracking-widest">FRIENDS' ACTIVITY</span>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1">
                {MOCK_REVIEWS.map((review, i) => (
                    <div key={i} className="flex flex-col gap-1 group cursor-pointer">
                        <div className="relative aspect-[2/3] rounded overflow-hidden border border-white/10 group-hover:border-[#00e054] transition-colors">
                            <img src={review.img} alt={review.title} className="w-full h-full object-cover" />
                            <div className="absolute top-1 right-1 bg-black/60 px-1 rounded flex items-center gap-0.5">
                                <span className="text-[10px] text-[#00e054]">★</span>
                                <span className="text-[10px]">{review.rating}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60 text-[9px]">
                            <div className="w-3 h-3 rounded-full bg-zinc-700" />
                            <span className="truncate">{review.user}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LetterboxdWidget;
