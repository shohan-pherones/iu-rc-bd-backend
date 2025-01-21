"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipValidations = void 0;
const zod_1 = require("zod");
const membershipSchema = zod_1.z.object({
    volunteerPass: zod_1.z.string(),
});
exports.MembershipValidations = {
    membershipSchema,
};
