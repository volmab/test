import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/utils";
import { createCompaniesWorkflow } from "../../../workflows/company/workflows/create-companies";
import {
  StoreCreateCompanyType,
  StoreGetCompanyParamsType,
} from "./validators";

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetCompanyParamsType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { fields, pagination } = req.queryConfig;

  const { data: companies, metadata } = await query.graph({
    entity: "companies",
    fields,
    filters: req.filterableFields,
    pagination,
  });

  res.json({
    companies,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<
    StoreCreateCompanyType | StoreCreateCompanyType[]
  >,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { result: createdCompanies } = await createCompaniesWorkflow.run({
    input: Array.isArray(req.validatedBody)
      ? req.validatedBody.map((company) => ({ ...company }))
      : [{ ...req.validatedBody }],
    container: req.scope,
  });

  const { data: companies } = await query.graph(
    {
      entity: "companies",
      fields: req.queryConfig.fields,
      filters: { id: createdCompanies.map((company) => company.id) },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ companies });
};
