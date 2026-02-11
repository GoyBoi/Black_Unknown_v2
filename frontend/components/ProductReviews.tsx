'use client';

import React, { useState } from 'react';
import { StarIcon, UserIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
  initialReviews?: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, initialReviews = [] }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reviewToAdd: Review = {
      id: reviews.length + 1,
      userName: 'John Doe',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      likes: 0,
      verified: true
    };
    
    setReviews([reviewToAdd, ...reviews]);
    setNewReview({ rating: 5, title: '', comment: '' });
    setShowWriteReview(false);
  };

  const handleLikeReview = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, likes: review.likes + 1 } : review
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-gold fill-current' : 'text-foreground/30'}`}
      />
    ));
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Customer Reviews</h2>
        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="bg-foreground text-background px-4 py-2 rounded-lg font-medium hover:bg-foreground/90 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-foreground/5 rounded-lg p-6 mb-8 border border-foreground/10">
          <h3 className="text-lg font-bold text-foreground mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-foreground/80 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`w-6 h-6 ${
                        star <= newReview.rating ? 'text-gold fill-current' : 'text-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="review-title" className="block text-foreground/80 mb-2">
                Review Title
              </label>
              <input
                type="text"
                id="review-title"
                value={newReview.title}
                onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                className="w-full p-3 bg-background border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-gold focus:outline-none"
                placeholder="Summarize your experience"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="review-comment" className="block text-foreground/80 mb-2">
                Your Review
              </label>
              <textarea
                id="review-comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                rows={4}
                className="w-full p-3 bg-background border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-gold focus:outline-none"
                placeholder="Share your experience with this product"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowWriteReview(false)}
                className="px-4 py-2 border border-foreground/20 rounded-lg text-foreground hover:bg-foreground/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-foreground/10 pb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{review.userName}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        {review.verified && (
                          <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-foreground/60">{review.date}</span>
                  </div>
                  
                  <h5 className="font-bold text-foreground mt-2">{review.title}</h5>
                  <p className="text-foreground/80 mt-2">{review.comment}</p>
                  
                  <div className="flex items-center mt-3">
                    <button
                      onClick={() => handleLikeReview(review.id)}
                      className="flex items-center text-sm text-foreground/60 hover:text-foreground"
                    >
                      <HeartIcon className="w-4 h-4 mr-1" />
                      {review.likes} people found this helpful
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-foreground/60">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;