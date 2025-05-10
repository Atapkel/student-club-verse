
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { eventService } from "@/services/eventService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EventReviewFormProps {
  eventId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Please provide a longer comment"),
});

type FormData = z.infer<typeof formSchema>;

const EventReviewForm: React.FC<EventReviewFormProps> = ({ 
  eventId, 
  onSuccess, 
  onCancel 
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });
  
  const createReviewMutation = useMutation({
    mutationFn: (data: FormData) => 
      eventService.createReview(eventId, data.rating, data.comment),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      onSuccess();
    },
    onError: (error) => {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  });
  
  const onSubmit = (data: FormData) => {
    createReviewMutation.mutate(data);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Write Your Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className={`text-2xl focus:outline-none ${
                            star <= field.value ? "text-amber-500" : "text-gray-300"
                          }`}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this event..."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={createReviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createReviewMutation.isPending}
              >
                {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EventReviewForm;
