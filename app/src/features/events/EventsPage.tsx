import { AppHeader } from "@/components/shared/AppHeader";
import { Calendar } from "./components/Calendar";
import { RecentEvents } from "./components/RecentEvents";

export function EventsPage() {
    return (
        <section className="stack-md">
            <AppHeader label="Events of CvSU" />
            <div className="grid grid-cols-3 gap-2">
                <Calendar className="col-span-2" />
                <RecentEvents />
            </div>
        </section>
    )
}