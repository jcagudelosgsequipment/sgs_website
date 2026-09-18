import { forwardRef, type MouseEventHandler, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { rentalInquiryHref } from "@/lib/rentalEquipment";
import type { EquipmentItem } from "@/types/equipment";

type RentalInquiryLinkProps = {
  equipment: Pick<EquipmentItem, "id" | "model" | "displayName">;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  children: ReactNode;
};

export const RentalInquiryLink = forwardRef<HTMLAnchorElement, RentalInquiryLinkProps>(
  function RentalInquiryLink({ equipment, className, onClick, children }, ref) {
    const href = rentalInquiryHref(equipment);
    if (/^https?:\/\//i.test(href)) {
      return (
        <a href={href} className={className} onClick={onClick} ref={ref}>
          {children}
        </a>
      );
    }

    return (
      <Link to={href} className={className} onClick={onClick} ref={ref}>
        {children}
      </Link>
    );
  }
);
