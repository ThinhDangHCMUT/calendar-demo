import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Checkbox,
  InputNumber,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Event, EventType, RecurrenceType } from "../types";
import useCalendarStore from "@/stores/useCalendarStore";
import { Trash2Icon } from "lucide-react";
import { cn } from "@/utils";

const { Option } = Select;

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  selectedDate: dayjs.Dayjs;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  type: Yup.string()
    .oneOf(Object.values(EventType))
    .required("Event type is required"),
  startTime: Yup.date().required("Start time is required"),
  endTime: Yup.date()
    .min(Yup.ref("startTime"), "End time must be after start time")
    .required("End time is required"),
  description: Yup.string(),
  clientInfo: Yup.object().shape({
    name: Yup.string(),
    profileUrl: Yup.string().url("Invalid URL"),
  }),
  recurrence: Yup.object().shape({
    type: Yup.string().oneOf(Object.values(RecurrenceType)),
    interval: Yup.number(),
    endDate: Yup.date(),
    daysOfWeek: Yup.array().of(Yup.number().min(0).max(6)),
  }),
});

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  mode,
  selectedDate,
}) => {
  const { createEvent, updateEvent, selectedEvent, deleteEvent } =
    useCalendarStore();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      type: EventType.APPOINTMENT,
      startTime: selectedDate.toDate(),
      endTime: selectedDate.add(1, "hour").toDate(),
      description: "",
      clientInfo: { name: "", profileUrl: "" },
      recurrence: {
        type: RecurrenceType.NONE,
        interval: 1,
        daysOfWeek: [],
      },
    },
  });

  const eventType = watch("type");
  const recurrenceType = watch("recurrence.type");

  React.useEffect(() => {
    if (mode === "edit" && selectedEvent) {
      reset(selectedEvent as any);
    } else if (mode === "create") {
      reset({
        title: "",
        type: EventType.APPOINTMENT,
        startTime: selectedDate.toDate(),
        endTime: selectedDate.add(1, "hour").toDate(),
        description: "",
        clientInfo: { name: "", profileUrl: "" },
        recurrence: {
          type: RecurrenceType.NONE,
          interval: 1,
          daysOfWeek: [],
        },
      });
    }
  }, [mode, selectedEvent, selectedDate, reset]);

  const onSubmit = (data: Event) => {
    if (mode === "create") {
      createEvent({
        ...data,
        id: data.title + Date.now(),
      });
    } else if (mode === "edit" && selectedEvent) {
      updateEvent({ ...selectedEvent, ...data });
    }

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      title={mode === "create" ? "Create Event" : "Edit Event"}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit as any)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Title"
              validateStatus={errors.title ? "error" : ""}
              help={errors.title?.message as string}
            >
              <Input {...field} />
            </Form.Item>
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Event Type"
              validateStatus={errors.type ? "error" : ""}
              help={errors.type?.message as string}
            >
              <Select {...field}>
                <Option value={EventType.APPOINTMENT}>Appointment</Option>
                <Option value={EventType.WEBINAR}>Webinar</Option>
              </Select>
            </Form.Item>
          )}
        />

        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Start Time"
              validateStatus={errors.startTime ? "error" : ""}
              help={errors.startTime?.message as string}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                {...field}
                value={field.value ? dayjs(field.value) : undefined}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="End Time"
              validateStatus={errors.endTime ? "error" : ""}
              help={errors.endTime?.message as string}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                {...field}
                value={field.value ? dayjs(field.value) : undefined}
              />
            </Form.Item>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Description"
              validateStatus={errors.description ? "error" : ""}
              help={errors.description?.message as string}
            >
              <Input.TextArea {...field} rows={4} />
            </Form.Item>
          )}
        />

        {eventType === EventType.APPOINTMENT && (
          <>
            <Controller
              name="clientInfo.name"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Client Name"
                  validateStatus={errors.clientInfo?.name ? "error" : ""}
                  help={errors.clientInfo?.name?.message as string}
                >
                  <Input {...field} />
                </Form.Item>
              )}
            />

            <Controller
              name="clientInfo.profileUrl"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Client Profile URL"
                  validateStatus={errors.clientInfo?.profileUrl ? "error" : ""}
                  help={errors.clientInfo?.profileUrl?.message as string}
                >
                  <Input {...field} />
                </Form.Item>
              )}
            />
          </>
        )}

        <Controller
          name="recurrence.type"
          control={control}
          render={({ field }) => (
            <Form.Item
              label="Recurrence"
              validateStatus={errors.recurrence?.type ? "error" : ""}
              // help={errors.recurrence?.type?.message as string}
            >
              <Select {...field}>
                <Option value={RecurrenceType.NONE}>None</Option>
                <Option value={RecurrenceType.DAILY}>Daily</Option>
                <Option value={RecurrenceType.WEEKLY}>Weekly</Option>
                <Option value={RecurrenceType.MONTHLY}>Monthly</Option>
                <Option value={RecurrenceType.YEARLY}>Yearly</Option>
              </Select>
            </Form.Item>
          )}
        />

        {recurrenceType !== RecurrenceType.NONE && (
          <>
            <Controller
              name="recurrence.interval"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="Repeat every"
                  validateStatus={errors.recurrence?.interval ? "error" : ""}
                  help={errors.recurrence?.interval?.message as string}
                >
                  <InputNumber {...field} min={1} />
                  <span style={{ marginLeft: 8 }}>
                    {recurrenceType === RecurrenceType.DAILY && "days"}
                    {recurrenceType === RecurrenceType.WEEKLY && "weeks"}
                    {recurrenceType === RecurrenceType.MONTHLY && "months"}
                    {recurrenceType === RecurrenceType.YEARLY && "years"}
                  </span>
                </Form.Item>
              )}
            />

            {recurrenceType === RecurrenceType.WEEKLY && (
              <Controller
                name="recurrence.daysOfWeek"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Repeat on"
                    validateStatus={
                      errors.recurrence?.daysOfWeek ? "error" : ""
                    }
                    help={errors.recurrence?.daysOfWeek?.message as string}
                  >
                    <Checkbox.Group
                      options={[
                        { label: "Sun", value: 0 },
                        { label: "Mon", value: 1 },
                        { label: "Tue", value: 2 },
                        { label: "Wed", value: 3 },
                        { label: "Thu", value: 4 },
                        { label: "Fri", value: 5 },
                        { label: "Sat", value: 6 },
                      ]}
                      {...field}
                    />
                  </Form.Item>
                )}
              />
            )}

            <Controller
              name="recurrence.endDate"
              control={control}
              render={({ field }) => (
                <Form.Item
                  label="End Date"
                  validateStatus={errors.recurrence?.endDate ? "error" : ""}
                  help={errors.recurrence?.endDate?.message as string}
                >
                  <DatePicker {...field} />
                </Form.Item>
              )}
            />
          </>
        )}

        <Form.Item>
          <Space className="flex justify-between">
            {
              <button
                className={cn(
                  "border-red-500 text-red-500 border p-1 px-4 hover:opacity-70 rounded-md",
                  mode === "create" ? "hidden" : ""
                )}
                onClick={() => {
                  if (selectedEvent && mode === "edit") {
                    deleteEvent(selectedEvent.id);
                  }
                  onClose();
                }}
              >
                <Trash2Icon size={20} />
              </button>
            }
            <div className="gap-2 flex">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {mode === "create" ? "Create" : "Update"}
              </Button>
            </div>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventModal;
