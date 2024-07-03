"use client";
import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

const VideoSummary = ({ Summary }: { Summary: string }) => {
  return (
    <Accordion className="px-0 mt-4" variant="splitted">
      <AccordionItem title="详情">
        <h2 className="text-gray-300">{Summary}</h2>
      </AccordionItem>
    </Accordion>
  );
};

export default VideoSummary;
