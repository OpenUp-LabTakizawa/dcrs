import type { ProfileFormItem } from "@/app/interfaces/form"
import type { Index } from "@/app/interfaces/index"
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  HandThumbUpIcon,
  IdentificationIcon,
  PencilSquareIcon,
  PhoneIcon,
  PhotoIcon,
  TableCellsIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/solid"

export const SITE_TITLE: string = "障がい者手帳\n登録システム"
export const TEST_BUCKET: string = "dcrs-test"
export const USERS_LINK: Index = {
  name: "登録データ一覧",
  icon: TableCellsIcon,
  color: "text-secondary",
  href: "/users",
}

export const STEPS: Index[] = [
  {
    name: "必要情報の入力",
    icon: PencilSquareIcon,
    color: "text-info",
  },
  {
    name: "入力確認",
    icon: CheckCircleIcon,
    color: "text-warning",
  },
  { name: "完了", icon: HandThumbUpIcon, color: "text-success" },
] as const

export const NAME: ProfileFormItem = {
  name: "name",
  label: "氏名",
  type: "text",
  icon: UserIcon,
  placeholder: "オープン太郎",
}

export const COMPANY: ProfileFormItem = {
  name: "company",
  label: "所属会社",
  type: "select",
  icon: BuildingOffice2Icon,
}

export const EMPLOYEE_ID: ProfileFormItem = {
  name: "employeeId",
  label: "社員番号",
  type: "number",
  icon: IdentificationIcon,
  placeholder: "123456",
}

export const TELEPHONE: ProfileFormItem = {
  name: "telephone",
  label: "電話番号",
  type: "tel",
  icon: PhoneIcon,
  placeholder: "09012345678",
}

export const EMAIL: ProfileFormItem = {
  name: "email",
  label: "Eメール",
  type: "email",
  icon: EnvelopeIcon,
  placeholder: "example@mail.com",
}

export const AGREEMENT: ProfileFormItem = {
  name: "agreement",
  label: "個人情報提供への同意",
  type: "checkbox",
  icon: CheckCircleIcon,
  placeholder: "同意する",
}

export const IMAGE: ProfileFormItem = {
  name: "image",
  label: "障がい者手帳の画像",
  type: "file",
  icon: PhotoIcon,
}

export const INDEX_LIST: Index[] = [
  {
    name: "ID",
    icon: TagIcon,
    color: "text-warning",
  },
  {
    name: "登録日時",
    icon: ClockIcon,
    color: "text-primary",
  },
  {
    name: NAME.label,
    icon: NAME.icon,
    color: "text-error",
  },
  {
    name: COMPANY.label,
    icon: COMPANY.icon,
    color: "text-success",
  },
  {
    name: EMPLOYEE_ID.label,
    icon: EMPLOYEE_ID.icon,
    color: "text-secondary",
  },
  {
    name: TELEPHONE.label,
    icon: TELEPHONE.icon,
    color: "text-warning",
  },
  {
    name: EMAIL.label,
    icon: EMAIL.icon,
    color: "text-info",
  },
  {
    name: IMAGE.label,
    icon: IMAGE.icon,
    color: "text-accent",
  },
] as const
