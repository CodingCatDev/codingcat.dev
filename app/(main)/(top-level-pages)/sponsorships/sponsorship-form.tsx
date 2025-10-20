
'use client';

import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CloudflareTurnstileWidget } from "@/components/cloudflare-turnstile";
import { formSchema } from "@/lib/sponsorship-schema";

export function SponsorshipForm({ sponsorshipTiers }: { sponsorshipTiers: any[] }) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            companyName: "",
            sponsorshipTier: [],
            message: "",
            honeypot: "",
            "cf-turnstile-response": "",
        },
    });

    	async function onSubmit(values: z.infer<typeof formSchema>) {
    		setIsSubmitting(true);
    		// Honeypot check
    		if (values.honeypot) {
    			toast.error("Spam detected!");
    			setIsSubmitting(false);
    			return;
    		}
    
    		const response = await fetch("/api/sponsorship", {
    			method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    			},
    			body: JSON.stringify(values),
    		});
    
    		const result = await response.json();
    
    		if (response.ok) {
    			toast.success("Sponsorship request submitted successfully!");
    			form.reset();
    			setIsSuccess(true);
    			setTimeout(() => {
    				router.push("/sponsors/page/1");
    			}, 3000);
    		} else {
    			toast.error(result.message, {
    				description: result.details ? JSON.stringify(result.details) : "",
    			});
    			if (result.message === "Invalid CAPTCHA") {
    				window.location.reload();
    			}
    		}
    		setIsSubmitting(false);
    	}
    
    	if (isSuccess) {
    		return (
    			<div className="container px-5 mx-auto">
    				<div className="w-full flex flex-col gap-4 md:gap-8 my-8 md:my-12 items-center">
    					<h1 className="text-3xl font-bold">Thank you for your submission!</h1>
    					<p>We will get back to you shortly.</p>
    					<p>Redirecting you to our sponsors page...</p>
    				</div>
    			</div>
    		);
    	}
    
        return (
            <div className="my-8">
                <h2 className="text-2xl font-bold text-center">
                    Ready to Sponsor?
                </h2>
                <p className="text-center text-muted-foreground">
                    Fill out the form below to get in touch.
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 max-w-xl mx-auto mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Company" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sponsorshipTier"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">Sponsorship Tiers of Interest</FormLabel>
                                        <FormDescription>
                                            Select all that apply.
                                        </FormDescription>
                                    </div>
                                    {sponsorshipTiers.map((item) => (
                                        <FormField
                                            key={item.value}
                                            control={form.control}
                                            name="sponsorshipTier"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.value}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.value)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.value])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value: string) => value !== item.value,
                                                                            ),
                                                                        );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {item.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about your company and what you'd like to promote."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Honeypot field - do not remove */}
                        <FormField
                            control={form.control}
                            name="honeypot"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cf-turnstile-response"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormControl>
                                        <CloudflareTurnstileWidget {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
    						{isSubmitting ? "Submitting..." : "Submit Request"}
    					</Button>
                    </form>
                </Form>
            </div>    );
}
