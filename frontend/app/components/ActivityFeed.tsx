import { Activity } from "react";
type Activity = {
    id: number;
    message : string;
    time : string;
};
const activities :Activity[] = [
    {
        id:1,
        message :"Router Agent classified a new ticket",
        time : "2 minutes age"
    },
    {
        id:2,
        message :"Billing Agent proocessed a payment issue",
        time : "10 minutes age"
    },
    {
        id:3,
        message :"Order Agent resolved an order issue",
        time : "25 minutes age"
    },
    {
        id:4,
        message :"Ticket escalated to human support",
        time : "40 minutes age"
    },
];
export default function ActivityFeed () {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="mt-4 space-y-4">
                {activities.map((activity) =>(
                    <div key={activity.id} className="border-b pb-4">
                        <p className="font-medium text-gray-900">{activity.message}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            {activity.time}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}