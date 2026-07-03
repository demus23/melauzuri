import User from "@/lib/models/User";

export async function grantAccess(order: any) {
  const customer = await User.findById(order.userId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (order.product === "course") {
    customer.hasCourseAccess = true;
  }

  if (order.product === "consultation") {
    customer.hasConsultationAccess = true;
  }

  if (order.product === "bundle") {
    customer.hasCourseAccess = true;
    customer.hasConsultationAccess = true;
  }

  await customer.save();

  return customer;
}