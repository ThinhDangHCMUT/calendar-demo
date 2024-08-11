import React from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { Event, EventType } from "../types";
import useCalendarStore from "@/stores/useCalendarStore";

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
    profileUrl: Yup.string(),
  }),
});

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, mode }) => {
  const { createEvent, updateEvent, selectedEvent, selectedDate } =
    useCalendarStore();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    // defaultValues:
    //   mode === "create"
    //     ? {
    //         title: "",
    //         type: EventType.APPOINTMENT,
    //         startTime: selectedDate.startOf("day").toDate(),
    //         endTime: selectedDate.startOf("day").add(1, "hour").toDate(),
    //         description: "",
    //         clientInfo: { name: "", profileUrl: "" },
    //       }
    //     : selectedEvent,
  });

  const eventType = watch("type");

  React.useEffect(() => {
    if (mode === "edit" && selectedEvent) {
      reset(selectedEvent as any);
    } else if (mode === "create") {
      reset({
        title: "",
        type: EventType.APPOINTMENT,
        startTime: selectedDate.startOf("day").toDate(),
        endTime: selectedDate.startOf("day").add(1, "hour").toDate(),
        description: "",
        clientInfo: { name: "", profileUrl: "" },
      });
    }
  }, [mode, selectedEvent, selectedDate, reset]);

  const onSubmit = (data: Event) => {
    if (mode === "create") {
      createEvent(data);
    } else if (mode === "edit" && selectedEvent) {
      updateEvent({ ...selectedEvent, ...data });
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      title={mode === "create" ? "Create Event" : "Edit Event"}
      onClose={onClose}
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
              //   help={errors.title?.message}
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
                format="HH:mm:ss"
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
              help={errors.startTime?.message as string}
            >
              <DatePicker
                showTime
                format="HH:mm:ss"
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
              help={errors.startTime?.message as string}
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
                  //   validateStatus={errors.clientInfo?.name ? "error" : ""}
                  //   help={errors.clientInfo?.name?.message}
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
                  //   validateStatus={errors.clientInfo?.profileUrl ? "error" : ""}
                  //   help={errors.startTime?.message as string}
                >
                  <Input {...field} />
                </Form.Item>
              )}
            />
          </>
        )}

        <Form.Item>
          <Space className="flex justify-end">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventModal;
