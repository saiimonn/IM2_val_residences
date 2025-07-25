import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface priorityBadgeInterface {
    priority: "urgent" | "high" | "medium" | "low" | string;
}

export const GetPriorityBadge = ({ priority }:priorityBadgeInterface) => {
    switch(priority) {
        case "urgent":
            return(
                <Badge variant = "destructive" className = "text-xs">
                    Urgent
                </Badge>
            )

        case "high":
            return(
                <Badge variant = "secondary" className = "bg-red-100 text-red-800 hover:text-red-100 text-xs">
                    High
                </Badge>
            )
        
        case "medium":
            return(
                <Badge variant = "secondary" className = "bg-orange-100 text-orange-800 hover:text-orange-100 text-xs">
                    Medium
                </Badge>
            )

        case "low":
            return(
                <Badge variant = "secondary" className = "bg-green-100 text-green-800 hover:text-green-100 text-xs">
                    Low
                </Badge>
            )

        default:
            return(
                <Badge variant = "outline" className = "text-xs">
                    {priority}
                </Badge>
            )
    }
}

interface getStatusBadgeProps {
    status: "pending" | "in_progress" | "completed" | "cancelled" | string;
}

export const GetStatusBadge = ({ status }:getStatusBadgeProps) => {
    switch(status) {
        case "pending":
            return(
                <Badge variant = "secondary" className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className = "size-3 mr-1" />
                    Pending
                </Badge>
            )
        
        case "in_progress":
            return(
                <Badge variant = "secondary" className = "bg-blue-100 text-blue-800 hover:text-blue-100">
                    <AlertCircle className = "size-3 mr-1"/>
                    In Progress
                </Badge>
            )
        
        case "completed":
            return(
                <Badge variant = "secondary" className = "bg-green-100 text-green-800 hover:text-green-100">
                    <CheckCircle className = "size-3 mr-1" />
                    Completed
                </Badge>
            )
        
        case "cancelled":
            return(
                <Badge variant = "secondary" className = "bg-gray-100 text-gray-800 hover:text-gray-100">
                    <XCircle className = "size-3 mr-1" />
                    Cancelled
                </Badge>
            )
    }
}