import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import ReactMarkdown from "react-markdown";
interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: string | null;
}
const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  announcement,
}) => {
  const handleClose = () => {
    onClose();
  };

  if (!announcement) {
    return null; // 如果没有公告数据，则返回 null 或者加载状态
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">公告</ModalHeader>
        <ModalBody>
          <ReactMarkdown>{announcement}</ReactMarkdown>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AnnouncementModal;
