import { Layout } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import advancedFormat from "dayjs/plugin/advancedFormat";
import SmallCalendar from "../components/SmallCalendar";
import LargeCalendar from "../components/LargeCalendar";
import EventList from "../components/EventList";
import useCalendarStore from "@/stores/useCalendarStore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

const { Content, Sider } = Layout;

export default function Home() {
  const { events, selectedDate, setSelectedDate } = useCalendarStore();

  return (
    <Layout className="min-h-screen px-28 pt-6 gap-4 bg-calendar-tile">
      <Sider
        width={350}
        style={{
          overflowX: "hidden",
          backgroundColor: "#E4F6ED",
        }}
      >
        <SmallCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          events={events}
        />
        <EventList
          events={events.filter((event) =>
            dayjs(event.startTime).isSame(selectedDate, "day")
          )}
        />
      </Sider>
      <Content>
        <LargeCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          events={events}
        />
      </Content>
    </Layout>
  );
}
