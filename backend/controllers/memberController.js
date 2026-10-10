import Member from "../models/Member.js";
import Transaction from "../models/Transaction.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findMemberOr404 = async (id, res) => {
  const member = await Member.findById(id);
  if (!member) {
    res.status(404);
    throw new Error("Member not found");
  }
  return member;
};

// POST /api/members
export const createMember = async (req, res) => {
  const { name, email, phone, address, membershipDate } = req.body;
  const member = await Member.create({ name, email, phone, address, membershipDate });
  res.status(201).json({ success: true, message: "Member added successfully", data: member });
};

// GET /api/members?search=ali
export const getMembers = async (req, res) => {
  const { search } = req.query;
  const filter = {};

  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const members = await Member.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: members.length, data: members });
};

// GET /api/members/:id
export const getMemberById = async (req, res) => {
  const member = await findMemberOr404(req.params.id, res);
  res.json({ success: true, data: member });
};

// PUT /api/members/:id
export const updateMember = async (req, res) => {
  const member = await findMemberOr404(req.params.id, res);
  const { name, email, phone, address, membershipDate } = req.body;

  if (name !== undefined) member.name = name;
  if (email !== undefined) member.email = email;
  if (phone !== undefined) member.phone = phone;
  if (address !== undefined) member.address = address;
  if (membershipDate !== undefined) member.membershipDate = membershipDate;

  const updated = await member.save();
  res.json({ success: true, message: "Member updated successfully", data: updated });
};

// DELETE /api/members/:id
export const deleteMember = async (req, res) => {
  const member = await findMemberOr404(req.params.id, res);

  // Agar member ke paas koi book issued hai to delete nahi hoga
  const issuedCount = await Transaction.countDocuments({
    memberId: member._id,
    status: "Issued",
  });
  if (issuedCount > 0) {
    res.status(400);
    throw new Error("Cannot delete: this member has books that are not returned yet");
  }

  await member.deleteOne();
  res.json({ success: true, message: "Member deleted successfully" });
};