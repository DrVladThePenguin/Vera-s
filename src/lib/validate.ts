import type { FounderDraft, InvestorDraft } from "@/lib/types";
import { hasNumber, isEmail, isUrl } from "@/lib/utils";

export function validateFounderStep(step: number, draft: FounderDraft) {
  const errors: Record<string, string> = {};
  if (step === 2) {
    if (!draft.founder.fullName.trim()) errors.fullName = "Enter your full name.";
    if (!draft.founder.jobTitle.trim()) errors.jobTitle = "Enter your role.";
    if (!isEmail(draft.founder.email)) errors.email = "Enter a valid email address.";
    if (!draft.founder.location.trim()) errors.location = "Enter your location.";
    if (draft.founder.bio.trim().length < 20) {
      errors.bio = "Add a short biography of at least 20 characters.";
    }
    if (draft.founder.linkedin.trim() && !/linkedin\.com/i.test(draft.founder.linkedin)) {
      errors.linkedin = "Enter a LinkedIn profile URL.";
    }
  }
  if (step === 3) {
    if (!draft.company.name.trim()) errors.companyName = "Enter the startup name.";
    if (!draft.company.industry) errors.industry = "Select an industry.";
    if (!draft.company.location.trim()) errors.companyLocation = "Enter the company location.";
    if (!draft.company.foundingYear) errors.foundingYear = "Select the founding year.";
    if (!draft.company.employees) errors.employees = "Select the team size.";
    if (draft.company.description.trim().length < 20) {
      errors.description = "Add a company description of at least 20 characters.";
    }
    if (!isUrl(draft.company.website)) errors.website = "Enter a valid website URL.";
  }
  if (step === 4) {
    if (draft.problem.problem.trim().length < 20) errors.problem = "Describe the problem in at least 20 characters.";
    if (draft.problem.audience.trim().length < 10) errors.audience = "Describe who experiences this problem.";
    if (draft.problem.solution.trim().length < 20) errors.solution = "Explain how the product solves it.";
    if (draft.problem.differentiation.trim().length < 10) {
      errors.differentiation = "Explain what makes the solution different.";
    }
  }
  if (step === 5) {
    if (!draft.product.name.trim()) errors.productName = "Enter the product name.";
    if (draft.product.description.trim().length < 20) {
      errors.productDescription = "Add a product description of at least 20 characters.";
    }
    if (!isUrl(draft.product.demoUrl)) errors.demoUrl = "Enter a valid demonstration URL.";
    if (!isUrl(draft.product.videoUrl)) errors.videoUrl = "Enter a valid video URL.";
  }
  if (step === 6) {
    if (!draft.market.targetMarket.trim()) errors.targetMarket = "Describe the target market.";
    if (!draft.market.targetCustomer.trim()) errors.targetCustomer = "Describe the target customer.";
    if (!draft.market.revenueModel) errors.revenueModel = "Select a revenue model.";
    if (draft.market.advantage.trim().length < 10) {
      errors.advantage = "Describe the competitive advantage.";
    }
  }
  if (step === 7) {
    const figures: Array<[string, string]> = [
      ["mrr", draft.traction.mrr],
      ["arr", draft.traction.arr],
      ["customers", draft.traction.customers],
      ["users", draft.traction.users],
      ["growth", draft.traction.growth],
      ["retention", draft.traction.retention],
    ];
    for (const [key, value] of figures) {
      if (!hasNumber(value)) errors[key] = "Use a number, or leave this blank.";
    }
  }
  if (step === 8 && !draft.fundraising.notFundraising) {
    if (!draft.fundraising.stage) errors.stage = "Select the current funding stage.";
    if (!hasNumber(draft.fundraising.previous)) errors.previous = "Use a number, or leave this blank.";
    if (!hasNumber(draft.fundraising.target)) errors.target = "Use a number, or leave this blank.";
    if (!hasNumber(draft.fundraising.desired)) errors.desired = "Use a number, or leave this blank.";
    if (draft.fundraising.useOfFunds.trim().length < 10) {
      errors.useOfFunds = "Describe how the funds will be used.";
    }
    if (draft.fundraising.investorTypes.length === 0) {
      errors.investorTypes = "Select at least one investor type.";
    }
  }
  if (step === 9) {
    draft.team.forEach((member, index) => {
      if (!member.name.trim()) errors[`team-${index}-name`] = "Enter this person's name.";
      if (!member.position.trim()) errors[`team-${index}-position`] = "Enter this person's position.";
      if (member.linkedin.trim() && !/linkedin\.com/i.test(member.linkedin)) {
        errors[`team-${index}-linkedin`] = "Enter a LinkedIn profile URL.";
      }
    });
  }
  return errors;
}

export function firstInvalidFounderStep(draft: FounderDraft) {
  for (const step of [2, 3, 4, 5, 6, 7, 8, 9]) {
    if (Object.keys(validateFounderStep(step, draft)).length > 0) return step;
  }
  return null;
}

export function validateInvestorStep(step: number, draft: InvestorDraft) {
  const errors: Record<string, string> = {};
  if (step === 2) {
    if (!draft.fullName.trim()) errors.fullName = "Enter your full name.";
    if (!draft.jobTitle.trim()) errors.jobTitle = "Enter your role.";
    if (!draft.location.trim()) errors.location = "Enter your location.";
  }
  if (step === 3) {
    if (!draft.organisation.trim()) errors.organisation = "Enter your organisation.";
    if (!draft.investorType) errors.investorType = "Select an investor type.";
    if (draft.bio.trim().length < 20) errors.bio = "Add a short biography of at least 20 characters.";
  }
  if (step === 4) {
    if (draft.industries.length === 0) errors.industries = "Select at least one industry.";
    if (draft.stages.length === 0) errors.stages = "Select at least one funding stage.";
    if (draft.geographies.length === 0) errors.geographies = "Select at least one geography.";
  }
  if (step === 5) {
    if (!draft.ticketMin.trim() || !hasNumber(draft.ticketMin)) errors.ticketMin = "Enter a minimum ticket size.";
    if (!draft.ticketMax.trim() || !hasNumber(draft.ticketMax)) errors.ticketMax = "Enter a maximum ticket size.";
  }
  return errors;
}

export function firstInvalidInvestorStep(draft: InvestorDraft) {
  for (const step of [2, 3, 4, 5]) {
    if (Object.keys(validateInvestorStep(step, draft)).length > 0) return step;
  }
  return null;
}
