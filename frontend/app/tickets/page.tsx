import TicketList from "../components/TicketList"
export default function TicketsPage () {
    return (
        <div className="p-6"> 
            <h1 className="texgt-3xl font-bold text-gray-900 ">Tickets</h1>
            <p className="mt-2 text-gray-500">Manage customer support tickets</p>
            <div className="mt-6">
                <TicketList />
            </div>
        </div>
    )
}
