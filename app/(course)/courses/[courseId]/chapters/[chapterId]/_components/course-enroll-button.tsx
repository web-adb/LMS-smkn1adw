"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, ShoppingCart } from "lucide-react"; // Import icons

interface CourseEnrollButtonProps {
    price: number; 
    courseId: string;
}

export const CourseEnrollButton = ({
    price,
    courseId
}: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/courses/${courseId}/checkout`);
            window.location.assign(response.data.url);
            toast.success("Enrollment successful!"); // Success message
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick} 
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto transition-all duration-300 hover:scale-105"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            Enroll for {formatPrice(price)}
        </Button>
    )
}