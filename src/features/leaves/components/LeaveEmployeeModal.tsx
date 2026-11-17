"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/TextArea";

import { LeaveOptions } from "@/data/LeaveOpions";
import { useCreateLeave } from "@/features/leaves/hooks/useCreateLeave";
import type { ICreateLeaveRequest } from "@/features/leaves/types/leave.type";
import { CalendarDays, FileTextIcon } from "lucide-react";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";



interface ILeaveEmployeeModalProps {
  close: () => void;
}

const LeaveEmployeeModal = ({ close }: ILeaveEmployeeModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateLeaveRequest>();

  const { mutate: createLeave, isPending } = useCreateLeave();

  const onSubmit = (data: ICreateLeaveRequest) => {
    createLeave(data, {
      onSuccess: () => {
        toast.success("Leave request submitted successfully!");
        close();
      },
      onError: () => {
        toast.error("Failed to submit leave request.");
      },
    });
  };

  return (
    <Modal
      title="Apply for Leave"
      description="Apply for Leave"
      close={close}
      maxWeight="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select
          icon={<FileTextIcon size={16} />}
          label="Leave Type"
          id="Leave Type"
          options={LeaveOptions}
          placeholderShow={false}
          {...register("type", {
            required: "Leave type is required",
          })}
        />

        <div>
          <div className="flex gap-2 items-center mb-2">
            <CalendarDays size={16} className="text-slate-400" />
            <p className="text-sm font-medium text-slate-700">Duration</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="From"
              id="from"
              type="date"
              {...register("startDate", {
                required: "Start date is required",
              })}
            />

            <Input
              label="To"
              id="to"
              type="date"
              {...register("endDate", {
                required: "End date is required",
              })}
            />
          </div>
        </div>

        <Textarea
          label="Reason"
          id="reason"
          placeholder="Briefly describe why you need this leave..."
          {...register("reason", {
            required: "Reason is required",
          })}
        />

        <div className="flex items-center gap-5">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            className="grow"
            onClick={close}
          >
            Cancel
          </Button>

          <Button type="submit" fullWidth className="grow" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeaveEmployeeModal;
