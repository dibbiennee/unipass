"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { StarRating } from "@/components/ui";
import { Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";

interface ProductReviewsProps {
  reviews: Review[];
  productId: string;
}

interface ReviewFormData {
  order_id: string;
  customer_email: string;
  display_name: string;
  comment: string;
}

export function ProductReviews({ reviews, productId }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>();

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast("Seleziona un voto", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          ...data,
        }),
      });

      if (res.ok) {
        toast("Recensione inviata! Sarà visibile dopo l'approvazione.", "success");
        setShowForm(false);
        reset();
        setRating(0);
      } else {
        const err = await res.json();
        toast(err.error || "Errore nell'invio della recensione", "error");
      }
    } catch {
      toast("Errore di connessione", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-body-lg font-bold">
          Recensioni ({reviews.length})
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Annulla" : "Scrivi recensione"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 rounded-brand bg-neutral-50 border border-neutral-200"
        >
          <div>
            <label className="block text-body-sm text-neutral-700 mb-2">
              Voto
            </label>
            <StarRating
              rating={rating}
              interactive
              onChange={setRating}
              size={24}
            />
          </div>

          <Input
            label="ID Ordine"
            placeholder="Il tuo ID ordine"
            error={errors.order_id?.message}
            {...register("order_id", { required: "Campo obbligatorio" })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="La tua email"
            error={errors.customer_email?.message}
            {...register("customer_email", { required: "Campo obbligatorio" })}
          />
          <Input
            label="Nome visualizzato"
            placeholder="Come vuoi apparire"
            error={errors.display_name?.message}
            {...register("display_name", { required: "Campo obbligatorio" })}
          />
          <div>
            <label className="block text-body-sm text-neutral-700 mb-1.5">
              Commento (opzionale)
            </label>
            <textarea
              className="w-full rounded-brand border border-neutral-200 bg-neutral-100 px-4 py-2.5 text-body-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="La tua opinione..."
              {...register("comment")}
            />
          </div>
          <Button type="submit" loading={submitting} className="w-full">
            Invia recensione
          </Button>
        </form>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="text-body-sm text-neutral-400 text-center py-6">
          Nessuna recensione ancora. Sii il primo!
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-brand bg-neutral-50 border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-medium text-neutral-800">
                  {review.display_name}
                </span>
                <StarRating rating={review.rating} size={12} />
              </div>
              <span className="text-caption text-neutral-400">
                {formatDate(review.created_at)}
              </span>
            </div>
            {review.comment && (
              <p className="text-body-sm text-neutral-500">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
