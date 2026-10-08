type TicketMessageProps = {
    message:string;
};
export default function TicketMessage ({message}:TicketMessageProps) {
   return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Customer Message
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        {message}
      </p>
    </div>
  );
}