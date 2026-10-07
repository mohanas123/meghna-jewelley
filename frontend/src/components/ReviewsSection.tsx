import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import type { Review } from '../types/index.ts';
import { submitReview } from '../services/api.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  onReviewAdded?: (review: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onReviewAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    setIsSubmitting(true);
    try {
      const newRev = await submitReview({
        author,
        location: location || 'India',
        comment,
        rating,
        verifiedBuyer: true,
      });

      onReviewAdded?.(newRev);
      setAuthor('');
      setLocation('');
      setComment('');
      setRating(5);
      setShowForm(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E2DBD0]">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#8C764D] font-semibold mb-1">
              Patron Testimonials
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1B18] font-normal">
              Words From Our Connoisseurs
            </h2>
            <p className="text-xs text-[#7A6E5E] mt-1.5">
              Reflections from brides, collectors, and royal family treasuries across India and worldwide.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="self-start sm:self-auto px-4 py-2 bg-white border border-[#C9A24D] text-[#8B6523] hover:bg-[#FAF5EB] rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{showForm ? 'Cancel Review' : 'Share Your Experience'}</span>
          </button>
        </div>

        {successNotice && (
          <div className="mb-6 p-4 bg-[#EAF5EC] border border-[#C2E5CB] text-[#256B3E] rounded text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#256B3E]" />
            <span>Thank you for your tribute! Your review has been published to our patron archives.</span>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded border border-[#E5DDD0] shadow-sm space-y-4 max-w-xl text-xs">
            <h4 className="font-serif text-base text-[#1E1B18] font-medium">Leave a Patron Testimonial</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#52493D] mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sundaram"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                />
              </div>
              <div>
                <label className="block text-[#52493D] mb-1 font-medium">City / Country</label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#52493D] mb-1 font-medium">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating ? 'fill-[#C9A24D] text-[#C9A24D]' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#52493D] mb-1 font-medium">Your Review & Craftsmanship Impression *</label>
              <textarea
                rows={3}
                required
                placeholder="Share your experience wearing your Meghna Jewellery piece..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#1E1B18] text-white rounded font-semibold uppercase tracking-wider text-xs hover:bg-[#342D25] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Post Testimonial'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded border border-[#E8E2D8] shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-[#C9A24D] text-[#C9A24D]' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  {rev.verifiedBuyer && (
                    <span className="text-[10px] text-[#256B3E] font-medium bg-[#EAF5EC] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#52493D] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2EDE2] flex items-center justify-between text-[11px] text-[#7A6E5E]">
                <div>
                  <strong className="text-[#1E1B18] font-medium block">{rev.author}</strong>
                  <span>{rev.location}</span>
                </div>
                <span className="text-[#9E907B]">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
