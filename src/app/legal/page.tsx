"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { BottomNav } from "@/components/BottomNav";

// ─── Language ────────────────────────────────────────────────────────────────

type Lang = "en" | "es" | "zh" | "tl" | "vi";

const LANGS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "zh", label: "中文" },
  { value: "tl", label: "Tagalog" },
  { value: "vi", label: "Tiếng Việt" },
];

const T: Record<Lang, {
  pageLabel: string;
  title: string;
  subtitle: string;
  notLegalAdvice: string;
  backDash: string;
  backHome: string;
  card1Title: string; card1Desc: string;
  card2Title: string; card2Desc: string;
  card3Title: string; card3Desc: string;
  goToSection: string;
  resourcesTitle: string;
  resourcesSubtitle: string;
  legalIssue: string;
  selectIssue: string;
  zipCode: string;
  zipPlaceholder: string;
  findResources: string;
  resourcesFound: string;
  resourceFound: string;
  noResults: string;
  visitWebsite: string;
  exhibitsTitle: string;
  exhibitsSubtitle: string;
  exhibit: string;
  docLabel: string;
  docNotes: string;
  addExhibit: string;
  saveList: string;
  saved: string;
  remove: string;
  formsTitle: string;
  formsSubtitle: string;
  selectState: string;
  selectForm: string;
  whichForm: string;
  describeYourSituation: string;
  situationPlaceholder: string;
  getGuidance: string;
  generating: string;
  draftGuidance: string;
  yourSituation: string;
  sectionsToComplete: string;
  disclaimerTitle: string;
  disclaimer: string;
  topics: { value: string; label: string }[];
}> = {
  en: {
    pageLabel: "Nazaya Haven", title: "Legal Navigation",
    subtitle: "Find legal resources, organize exhibits, and get help preparing legal forms. Nazaya Haven provides general information and resource navigation,",
    notLegalAdvice: "not legal advice.",
    backDash: "← Dashboard", backHome: "← Return to Nazaya Haven home",
    card1Title: "Find Legal Resources", card1Desc: "Locate free and low-cost legal aid by issue and ZIP code.",
    card2Title: "AI Exhibit Organizer", card2Desc: "Label and organize your documents for court.",
    card3Title: "AI Legal Form Assistant", card3Desc: "Get guidance filling out common court forms for your state.",
    goToSection: "Go to section →",
    resourcesTitle: "Find Legal Resources",
    resourcesSubtitle: "Select your legal issue and enter your ZIP code to find free and low-cost legal resources near you.",
    legalIssue: "Legal issue", selectIssue: "Select an issue…",
    zipCode: "ZIP code", zipPlaceholder: "e.g. 94110",
    findResources: "Find Resources",
    resourcesFound: "resources found", resourceFound: "resource found",
    noResults: "No resources found for that combination. Try selecting General Legal Aid or a different ZIP code.",
    visitWebsite: "Visit website →",
    exhibitsTitle: "AI Exhibit Organizer",
    exhibitsSubtitle: "Label and describe your documents so they are organized and easy to reference in court.",
    exhibit: "Exhibit", docLabel: "Document label (e.g. School Enrollment Record)", docNotes: "Notes about this document…",
    addExhibit: "+ Add Exhibit", saveList: "Save List", saved: "Saved ✓", remove: "Remove",
    formsTitle: "AI Legal Form Assistant",
    formsSubtitle: "Select your state and a form, then describe your situation. We will generate guidance to help you fill it out correctly.",
    selectState: "Select your state…", selectForm: "Select a form…",
    whichForm: "Which form do you need help with?",
    describeYourSituation: "Briefly describe your situation",
    situationPlaceholder: "e.g. I am requesting primary custody of my two children ages 5 and 8…",
    getGuidance: "Get Guidance", generating: "Generating…",
    draftGuidance: "Draft Guidance", yourSituation: "Your situation:",
    sectionsToComplete: "Sections to complete:",
    disclaimerTitle: "Disclaimer:", disclaimer: "Nazaya Haven provides general information and resource navigation only. Nothing on this page constitutes legal advice or creates an attorney-client relationship. For advice specific to your situation, please consult a licensed attorney.",
    topics: [
      { value: "general", label: "General Legal Aid" },
      { value: "custody", label: "Custody & Family Law" },
      { value: "housing", label: "Housing & Eviction" },
      { value: "immigration", label: "Immigration" },
      { value: "benefits", label: "Public Benefits" },
    ],
  },
  es: {
    pageLabel: "Nazaya Haven", title: "Navegación Legal",
    subtitle: "Encuentra recursos legales, organiza exhibiciones y obtén ayuda para preparar formularios legales. Nazaya Haven proporciona información general y navegación de recursos,",
    notLegalAdvice: "no asesoramiento legal.",
    backDash: "← Panel", backHome: "← Volver al inicio de Nazaya Haven",
    card1Title: "Encontrar Recursos Legales", card1Desc: "Localiza ayuda legal gratuita y de bajo costo por tema y código postal.",
    card2Title: "Organizador de Exhibiciones", card2Desc: "Etiqueta y organiza tus documentos para el tribunal.",
    card3Title: "Asistente de Formularios", card3Desc: "Obtén orientación para completar formularios comunes del tribunal.",
    goToSection: "Ir a la sección →",
    resourcesTitle: "Encontrar Recursos Legales",
    resourcesSubtitle: "Selecciona tu problema legal e ingresa tu código postal para encontrar recursos legales gratuitos y de bajo costo cerca de ti.",
    legalIssue: "Problema legal", selectIssue: "Selecciona un problema…",
    zipCode: "Código postal", zipPlaceholder: "ej. 94110",
    findResources: "Buscar Recursos",
    resourcesFound: "recursos encontrados", resourceFound: "recurso encontrado",
    noResults: "No se encontraron recursos para esa combinación. Intenta seleccionar Ayuda Legal General o un código postal diferente.",
    visitWebsite: "Visitar sitio web →",
    exhibitsTitle: "Organizador de Exhibiciones IA",
    exhibitsSubtitle: "Etiqueta y describe tus documentos para que estén organizados y sean fáciles de referenciar en el tribunal.",
    exhibit: "Exhibición", docLabel: "Etiqueta del documento (ej. Registro de inscripción escolar)", docNotes: "Notas sobre este documento…",
    addExhibit: "+ Añadir Exhibición", saveList: "Guardar Lista", saved: "Guardado ✓", remove: "Eliminar",
    formsTitle: "Asistente de Formularios Legales IA",
    formsSubtitle: "Selecciona tu estado y un formulario, luego describe tu situación. Generaremos orientación para ayudarte a completarlo correctamente.",
    selectState: "Selecciona tu estado…", selectForm: "Selecciona un formulario…",
    whichForm: "¿Con qué formulario necesitas ayuda?",
    describeYourSituation: "Describe brevemente tu situación",
    situationPlaceholder: "ej. Solicito la custodia principal de mis dos hijos de 5 y 8 años…",
    getGuidance: "Obtener Orientación", generating: "Generando…",
    draftGuidance: "Orientación Preliminar", yourSituation: "Tu situación:",
    sectionsToComplete: "Secciones a completar:",
    disclaimerTitle: "Aviso:", disclaimer: "Nazaya Haven proporciona solo información general y navegación de recursos. Nada en esta página constituye asesoramiento legal ni crea una relación abogado-cliente. Para asesoramiento específico, consulta con un abogado con licencia.",
    topics: [
      { value: "general", label: "Ayuda Legal General" },
      { value: "custody", label: "Custodia y Derecho de Familia" },
      { value: "housing", label: "Vivienda y Desalojo" },
      { value: "immigration", label: "Inmigración" },
      { value: "benefits", label: "Beneficios Públicos" },
    ],
  },
  zh: {
    pageLabel: "Nazaya Haven", title: "法律导航",
    subtitle: "查找法律资源、整理证据，并获得准备法律表格的帮助。Nazaya Haven提供一般信息和资源导航，",
    notLegalAdvice: "而非法律建议。",
    backDash: "← 控制面板", backHome: "← 返回Nazaya Haven主页",
    card1Title: "查找法律资源", card1Desc: "按问题和邮政编码查找免费和低成本的法律援助。",
    card2Title: "AI证据整理器", card2Desc: "标记并整理您的法庭文件。",
    card3Title: "AI法律表格助手", card3Desc: "获得填写常见法庭表格的指导。",
    goToSection: "前往该部分 →",
    resourcesTitle: "查找法律资源",
    resourcesSubtitle: "选择您的法律问题并输入邮政编码，以查找您附近的免费和低成本法律资源。",
    legalIssue: "法律问题", selectIssue: "选择一个问题…",
    zipCode: "邮政编码", zipPlaceholder: "如 94110",
    findResources: "查找资源",
    resourcesFound: "个资源已找到", resourceFound: "个资源已找到",
    noResults: "该组合未找到资源。请尝试选择「一般法律援助」或不同的邮政编码。",
    visitWebsite: "访问网站 →",
    exhibitsTitle: "AI证据整理器",
    exhibitsSubtitle: "标记并描述您的文件，使其在法庭上易于整理和参考。",
    exhibit: "证据", docLabel: "文件标签（如学校入学记录）", docNotes: "关于此文件的备注…",
    addExhibit: "+ 添加证据", saveList: "保存列表", saved: "已保存 ✓", remove: "删除",
    formsTitle: "AI法律表格助手",
    formsSubtitle: "选择您所在的州和表格，然后描述您的情况。我们将生成指导以帮助您正确填写。",
    selectState: "选择您的州…", selectForm: "选择一个表格…",
    whichForm: "您需要帮助填写哪个表格？",
    describeYourSituation: "简要描述您的情况",
    situationPlaceholder: "如：我申请对我5岁和8岁的两个孩子的主要监护权…",
    getGuidance: "获取指导", generating: "生成中…",
    draftGuidance: "草稿指导", yourSituation: "您的情况：",
    sectionsToComplete: "需要填写的部分：",
    disclaimerTitle: "免责声明：", disclaimer: "Nazaya Haven仅提供一般信息和资源导航。本页面上的任何内容均不构成法律建议，也不会建立律师-客户关系。如需针对您具体情况的建议，请咨询持牌律师。",
    topics: [
      { value: "general", label: "一般法律援助" },
      { value: "custody", label: "监护权与家庭法" },
      { value: "housing", label: "住房与驱逐" },
      { value: "immigration", label: "移民" },
      { value: "benefits", label: "公共福利" },
    ],
  },
  tl: {
    pageLabel: "Nazaya Haven", title: "Legal na Nabigasyon",
    subtitle: "Hanapin ang mga legal na mapagkukunan, ayusin ang mga exhibit, at humingi ng tulong sa paghahanda ng mga legal na form. Ang Nazaya Haven ay nagbibigay ng pangkalahatang impormasyon at nabigasyon ng mga mapagkukunan,",
    notLegalAdvice: "hindi legal na payo.",
    backDash: "← Dashboard", backHome: "← Bumalik sa Nazaya Haven home",
    card1Title: "Humanap ng Legal na Mapagkukunan", card1Desc: "Hanapin ang libreng at mababang halaga na legal na tulong ayon sa isyu at ZIP code.",
    card2Title: "AI Exhibit Organizer", card2Desc: "I-label at ayusin ang iyong mga dokumento para sa korte.",
    card3Title: "AI Legal Form Assistant", card3Desc: "Kumuha ng gabay sa pagpuno ng mga karaniwang form ng korte.",
    goToSection: "Pumunta sa seksyon →",
    resourcesTitle: "Humanap ng Legal na Mapagkukunan",
    resourcesSubtitle: "Piliin ang iyong legal na isyu at ilagay ang iyong ZIP code upang mahanap ang mga libreng at mababang halaga na legal na mapagkukunan malapit sa iyo.",
    legalIssue: "Legal na isyu", selectIssue: "Pumili ng isyu…",
    zipCode: "ZIP code", zipPlaceholder: "hal. 94110",
    findResources: "Humanap ng Mapagkukunan",
    resourcesFound: "mga mapagkukunan na natagpuan", resourceFound: "mapagkukunan na natagpuan",
    noResults: "Walang nahanap na mapagkukunan para sa kombinasyong iyon. Subukang piliin ang General Legal Aid o ibang ZIP code.",
    visitWebsite: "Bisitahin ang website →",
    exhibitsTitle: "AI Exhibit Organizer",
    exhibitsSubtitle: "I-label at ilarawan ang iyong mga dokumento upang maayos at madaling i-reference sa korte.",
    exhibit: "Exhibit", docLabel: "Label ng dokumento (hal. School Enrollment Record)", docNotes: "Mga tala tungkol sa dokumentong ito…",
    addExhibit: "+ Magdagdag ng Exhibit", saveList: "I-save ang Listahan", saved: "Na-save ✓", remove: "Alisin",
    formsTitle: "AI Legal Form Assistant",
    formsSubtitle: "Piliin ang iyong estado at isang form, pagkatapos ilarawan ang iyong sitwasyon. Makakakuha ka ng gabay para matulong sa iyo.",
    selectState: "Piliin ang iyong estado…", selectForm: "Pumili ng form…",
    whichForm: "Anong form ang kailangan mong tulungan?",
    describeYourSituation: "Maikling ilarawan ang iyong sitwasyon",
    situationPlaceholder: "hal. Humihingi ako ng pangunahing pag-aalaga sa aking dalawang anak na may edad 5 at 8…",
    getGuidance: "Kumuha ng Gabay", generating: "Nagge-generate…",
    draftGuidance: "Draft na Gabay", yourSituation: "Ang iyong sitwasyon:",
    sectionsToComplete: "Mga seksyong kukumpletuhin:",
    disclaimerTitle: "Paunawa:", disclaimer: "Ang Nazaya Haven ay nagbibigay lamang ng pangkalahatang impormasyon at nabigasyon ng mga mapagkukunan. Walang anumang nasa pahinang ito ang bumubuo ng legal na payo o lumilikha ng relasyon ng abogado-kliyente. Para sa payo na tukoy sa iyong sitwasyon, kumonsulta sa lisensyadong abogado.",
    topics: [
      { value: "general", label: "Pangkalahatang Legal na Tulong" },
      { value: "custody", label: "Custody at Family Law" },
      { value: "housing", label: "Pabahay at Eviction" },
      { value: "immigration", label: "Imigrasyon" },
      { value: "benefits", label: "Mga Pampublikong Benepisyo" },
    ],
  },
  vi: {
    pageLabel: "Nazaya Haven", title: "Điều Hướng Pháp Lý",
    subtitle: "Tìm tài nguyên pháp lý, sắp xếp bằng chứng và nhận trợ giúp chuẩn bị biểu mẫu pháp lý. Nazaya Haven cung cấp thông tin chung và điều hướng tài nguyên,",
    notLegalAdvice: "không phải tư vấn pháp lý.",
    backDash: "← Bảng Điều Khiển", backHome: "← Trở về trang chủ Nazaya Haven",
    card1Title: "Tìm Tài Nguyên Pháp Lý", card1Desc: "Tìm hỗ trợ pháp lý miễn phí và chi phí thấp theo vấn đề và mã bưu chính.",
    card2Title: "Trình Tổ Chức Bằng Chứng AI", card2Desc: "Đánh nhãn và sắp xếp tài liệu của bạn cho tòa án.",
    card3Title: "Trợ Lý Biểu Mẫu Pháp Lý AI", card3Desc: "Nhận hướng dẫn điền các biểu mẫu tòa án phổ biến.",
    goToSection: "Đến phần →",
    resourcesTitle: "Tìm Tài Nguyên Pháp Lý",
    resourcesSubtitle: "Chọn vấn đề pháp lý và nhập mã bưu chính để tìm tài nguyên pháp lý miễn phí và chi phí thấp gần bạn.",
    legalIssue: "Vấn đề pháp lý", selectIssue: "Chọn vấn đề…",
    zipCode: "Mã bưu chính", zipPlaceholder: "vd. 94110",
    findResources: "Tìm Tài Nguyên",
    resourcesFound: "tài nguyên được tìm thấy", resourceFound: "tài nguyên được tìm thấy",
    noResults: "Không tìm thấy tài nguyên cho sự kết hợp đó. Hãy thử chọn Hỗ Trợ Pháp Lý Chung hoặc mã bưu chính khác.",
    visitWebsite: "Truy cập trang web →",
    exhibitsTitle: "Trình Tổ Chức Bằng Chứng AI",
    exhibitsSubtitle: "Đánh nhãn và mô tả tài liệu của bạn để chúng được tổ chức và dễ tham chiếu tại tòa án.",
    exhibit: "Bằng chứng", docLabel: "Nhãn tài liệu (vd. Hồ sơ đăng ký trường học)", docNotes: "Ghi chú về tài liệu này…",
    addExhibit: "+ Thêm Bằng Chứng", saveList: "Lưu Danh Sách", saved: "Đã Lưu ✓", remove: "Xóa",
    formsTitle: "Trợ Lý Biểu Mẫu Pháp Lý AI",
    formsSubtitle: "Chọn tiểu bang và biểu mẫu, sau đó mô tả tình huống của bạn. Chúng tôi sẽ tạo hướng dẫn giúp bạn điền đúng.",
    selectState: "Chọn tiểu bang…", selectForm: "Chọn biểu mẫu…",
    whichForm: "Bạn cần giúp đỡ với biểu mẫu nào?",
    describeYourSituation: "Mô tả ngắn gọn tình huống của bạn",
    situationPlaceholder: "vd. Tôi yêu cầu quyền nuôi con chính của hai con tôi 5 và 8 tuổi…",
    getGuidance: "Nhận Hướng Dẫn", generating: "Đang tạo…",
    draftGuidance: "Hướng Dẫn Sơ Bộ", yourSituation: "Tình huống của bạn:",
    sectionsToComplete: "Các phần cần điền:",
    disclaimerTitle: "Tuyên bố miễn trách:", disclaimer: "Nazaya Haven chỉ cung cấp thông tin chung và điều hướng tài nguyên. Không có nội dung nào trên trang này cấu thành tư vấn pháp lý hoặc tạo ra mối quan hệ luật sư-khách hàng. Để được tư vấn cụ thể cho tình huống của bạn, hãy tham khảo ý kiến của luật sư được cấp phép.",
    topics: [
      { value: "general", label: "Hỗ Trợ Pháp Lý Chung" },
      { value: "custody", label: "Quyền Nuôi Con & Luật Gia Đình" },
      { value: "housing", label: "Nhà Ở & Trục Xuất" },
      { value: "immigration", label: "Di Trú" },
      { value: "benefits", label: "Phúc Lợi Công Cộng" },
    ],
  },
};

// ─── Resource data ────────────────────────────────────────────────────────────

type Resource = {
  name: string;
  description: string;
  phone?: string;
  url?: string;
  tag: "sf" | "cc" | "bay" | "ca";
  topics: ("general" | "custody" | "housing" | "immigration" | "benefits")[];
};

const RESOURCES: Resource[] = [
  { name: "Bay Area Legal Aid – San Francisco", description: "Free civil legal services for low-income residents of San Francisco.", phone: "(415) 982-1300", url: "https://baylegal.org", tag: "sf", topics: ["general", "housing", "benefits"] },
  { name: "Legal Aid Society of San Francisco", description: "Legal help for custody, family law, and civil matters in San Francisco.", phone: "(415) 982-1300", url: "https://www.sfbar.org/lawfoundation", tag: "sf", topics: ["general", "custody"] },
  { name: "Bar Association of San Francisco – Lawyer Referral", description: "Low-cost attorney referrals for SF residents covering most legal topics.", phone: "(415) 989-1616", url: "https://www.sfbar.org", tag: "sf", topics: ["general", "custody", "immigration"] },
  { name: "SF Family Court Self-Help Center", description: "In-person help completing family court forms including custody and support.", phone: "(415) 551-3888", tag: "sf", topics: ["custody"] },
  { name: "SF Human Services Agency – Benefits", description: "Help applying for CalFresh, Medi-Cal, and other public benefits in SF.", phone: "(415) 557-5000", url: "https://www.sf.gov/departments/human-services-agency", tag: "sf", topics: ["benefits"] },
  { name: "Bay Area Legal Aid – Contra Costa", description: "Free civil legal help for low-income Contra Costa residents.", phone: "(510) 250-5270", url: "https://baylegal.org", tag: "cc", topics: ["general", "housing", "benefits"] },
  { name: "Contra Costa County Bar Assoc. Lawyer Referral", description: "Affordable attorney referrals for family law, custody, and civil matters.", phone: "(925) 686-6900", url: "https://www.cccba.org", tag: "cc", topics: ["general", "custody"] },
  { name: "Contra Costa Superior Court Self-Help Center", description: "Walk-in help filling out court forms for family law and civil matters.", phone: "(925) 608-1010", tag: "cc", topics: ["custody", "general"] },
  { name: "Bay Area Legal Aid", description: "Free civil legal services across the Bay Area for qualifying individuals.", phone: "(415) 982-1300", url: "https://baylegal.org", tag: "bay", topics: ["general", "housing", "benefits", "custody"] },
  { name: "Centro Legal de la Raza", description: "Bilingual legal services (English/Spanish) for immigration and civil matters in the Bay Area.", phone: "(510) 437-1554", url: "https://centrolegal.org", tag: "bay", topics: ["general", "immigration"] },
  { name: "East Bay Community Law Center", description: "Free legal services for low-income residents in Alameda and Contra Costa counties.", phone: "(510) 548-4040", url: "https://ebclc.org", tag: "bay", topics: ["general", "housing", "immigration", "benefits"] },
  { name: "California Courts Self-Help Center", description: "Official state resource with forms, guides, and FAQs for all California courts.", url: "https://selfhelp.courts.ca.gov", tag: "ca", topics: ["general", "custody", "housing", "benefits", "immigration"] },
  { name: "LawHelpCA", description: "Statewide legal resource navigator — find legal aid by county and topic.", url: "https://www.lawhelpca.org", tag: "ca", topics: ["general", "custody", "housing", "benefits", "immigration"] },
  { name: "California DCSS – Child Support Services", description: "State child support enforcement and modification services.", phone: "1-866-901-3212", url: "https://www.dcss.ca.gov", tag: "ca", topics: ["custody"] },
  { name: "California Courts – Custody & Visitation", description: "Official guides and forms for custody, visitation, and parenting plans in California.", url: "https://www.courts.ca.gov/selfhelp-custody.htm", tag: "ca", topics: ["custody"] },
  { name: "ILRC – Immigration Legal Resource Center", description: "California-based immigration legal resources and attorney referrals.", url: "https://www.ilrc.org", tag: "ca", topics: ["immigration"] },
  { name: "Covered California", description: "Apply for health insurance and public benefits through California's marketplace.", url: "https://www.coveredca.com", tag: "ca", topics: ["benefits"] },
];

// ─── Court forms by state ─────────────────────────────────────────────────────

type FormTemplate = { value: string; label: string };
type FormSections = { title: string; detail: string }[];

const STATES: { value: string; label: string }[] = [
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "NY", label: "New York" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "WA", label: "Washington" },
  { value: "AZ", label: "Arizona" },
  { value: "NV", label: "Nevada" },
  { value: "OR", label: "Oregon" },
  { value: "CO", label: "Colorado" },
];

const FORMS_BY_STATE: Record<string, FormTemplate[]> = {
  CA: [
    { value: "custody", label: "Custody Petition (FL-300)" },
    { value: "support", label: "Child Support Request (FL-150)" },
    { value: "response", label: "Response to Petition (FL-120)" },
    { value: "declaration", label: "Declaration (MC-030)" },
  ],
  TX: [
    { value: "custody", label: "Suit Affecting the Parent-Child Relationship (SAPCR)" },
    { value: "support", label: "Child Support Review Request" },
    { value: "response", label: "Original Answer – Family Law" },
    { value: "declaration", label: "Affidavit / Declaration" },
  ],
  NY: [
    { value: "custody", label: "Petition for Custody/Visitation (Family Court)" },
    { value: "support", label: "Petition for Child Support (Family Ct. Act §413)" },
    { value: "response", label: "Answer to Petition" },
    { value: "declaration", label: "Affidavit in Support" },
  ],
  FL: [
    { value: "custody", label: "Petition for Parenting Plan / Time-Sharing (FL-220)" },
    { value: "support", label: "Child Support Guidelines Worksheet (FL-150)" },
    { value: "response", label: "Answer to Petition for Dissolution (FL-220)" },
    { value: "declaration", label: "Affidavit of Indigency (FL-932)" },
  ],
  IL: [
    { value: "custody", label: "Petition for Allocation of Parental Responsibilities" },
    { value: "support", label: "Child Support Complaint / Petition" },
    { value: "response", label: "Response / Answer to Petition" },
    { value: "declaration", label: "Affidavit / Verified Statement" },
  ],
  WA: [
    { value: "custody", label: "Parenting Plan Petition (FL All Family 140)" },
    { value: "support", label: "Child Support Worksheets (FL All Family 130)" },
    { value: "response", label: "Response to Petition (FL All Family 012)" },
    { value: "declaration", label: "Declaration (FL All Family 135)" },
  ],
  AZ: [
    { value: "custody", label: "Petition for Legal Decision-Making & Parenting Time" },
    { value: "support", label: "Child Support Request (DCS)" },
    { value: "response", label: "Response to Petition – Family Law" },
    { value: "declaration", label: "Affidavit / Sworn Statement" },
  ],
  NV: [
    { value: "custody", label: "Complaint for Custody (NRS 125C)" },
    { value: "support", label: "Motion to Establish Child Support" },
    { value: "response", label: "Answer to Complaint" },
    { value: "declaration", label: "Declaration Under Penalty of Perjury" },
  ],
  OR: [
    { value: "custody", label: "Petition for Custody (ORS 107)" },
    { value: "support", label: "Motion to Establish Child Support" },
    { value: "response", label: "Response to Petition" },
    { value: "declaration", label: "Affidavit / Declaration" },
  ],
  CO: [
    { value: "custody", label: "Petition for Allocation of Parental Responsibilities (JDF 1113)" },
    { value: "support", label: "Child Support Worksheet (JDF 1820)" },
    { value: "response", label: "Response to Petition (JDF 1104)" },
    { value: "declaration", label: "Affidavit (JDF 1111)" },
  ],
};

const SECTIONS_BY_TYPE: Record<string, FormSections> = {
  custody: [
    { title: "Petitioner Information", detail: "Your full legal name, address, and contact information." },
    { title: "Respondent Information", detail: "The other party's full name, address, and relationship to the children." },
    { title: "Children's Information", detail: "Full names, dates of birth, and current residence of each child." },
    { title: "Custody & Visitation Requested", detail: "Specify legal custody (decision-making) and physical custody (living arrangements) you are requesting." },
    { title: "Statement of Facts", detail: "Describe your situation clearly and chronologically — where the children live now, their school, and why your request is in their best interest." },
    { title: "Relief Requested", detail: "List exactly what you are asking the court to order, including any visitation schedule." },
  ],
  support: [
    { title: "Petitioner Information", detail: "Your full legal name, address, and employer information." },
    { title: "Respondent Information", detail: "The other party's name, address, and employer if known." },
    { title: "Children's Information", detail: "Names and ages of each child for whom support is sought." },
    { title: "Income & Expense Declaration", detail: "Monthly income from all sources, monthly expenses, and any hardships affecting ability to pay or need for support." },
    { title: "Relief Requested", detail: "The monthly support amount you are requesting and the date payments should begin." },
  ],
  response: [
    { title: "Responding Party Information", detail: "Your full legal name and contact information as the respondent." },
    { title: "Admissions & Denials", detail: "For each numbered paragraph in the petition, state whether you agree, disagree, or lack information." },
    { title: "Your Position", detail: "Describe your version of the facts and what outcome you believe is fair." },
    { title: "Relief Requested", detail: "What you are asking the court to order in your favor." },
  ],
  declaration: [
    { title: "Declarant Information", detail: "Your full legal name, address, and relationship to the case." },
    { title: "Statement Under Oath", detail: "Write numbered paragraphs of facts you personally know to be true — be specific and chronological." },
    { title: "Attached Exhibits", detail: "List and label any documents attached (e.g., Exhibit A — School enrollment record)." },
    { title: "Signature Block", detail: "Sign under penalty of perjury with date and location." },
  ],
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ExhibitEntry = { id: number; label: string; notes: string };
type FormGuidance = { formLabel: string; state: string; situation: string; sections: FormSections; tip: string };

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconScale() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
}
function IconFolderOpen() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>;
}
function IconDoc() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function IconSearch() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="rounded-3xl border border-lavender-deep/40 bg-cream-dark/80 p-6 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lavender text-purple-deep">{icon}</div>
        <h2 id={`${id}-heading`} className="text-xl font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ─── Resource finder ──────────────────────────────────────────────────────────

function ResourceFinder({ t }: { t: typeof T["en"] }) {
  const [topic, setTopic] = useState("");
  const [zip, setZip] = useState("");
  const [results, setResults] = useState<Resource[] | null>(null);

  const getRegion = (z: string): ("sf" | "cc" | "bay" | "ca")[] => {
    const p = z.slice(0, 3);
    if (p === "941") return ["sf", "bay", "ca"];
    if (p === "945" || p === "948") return ["cc", "bay", "ca"];
    return ["bay", "ca"];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !zip.trim()) return;
    const regions = getRegion(zip.trim());
    const matched = RESOURCES.filter(r => regions.includes(r.tag) && r.topics.includes(topic as "general" | "custody" | "housing" | "immigration" | "benefits"));
    const order = { sf: 0, cc: 0, bay: 1, ca: 2 };
    matched.sort((a, b) => order[a.tag] - order[b.tag]);
    setResults(matched);
  };

  const regionLabel = (tag: string) => ({ sf: "San Francisco", cc: "Contra Costa", bay: "Bay Area", ca: "California" })[tag] ?? tag;

  return (
    <div>
      <p className="mb-5 text-sm text-ink-muted">{t.resourcesSubtitle}</p>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="legal-topic" className="mb-1.5 block text-sm font-medium text-ink">{t.legalIssue}</label>
            <select id="legal-topic" value={topic} onChange={e => setTopic(e.target.value)} required className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-sm text-ink focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20">
              <option value="">{t.selectIssue}</option>
              {t.topics.map(tp => <option key={tp.value} value={tp.value}>{tp.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="zip-code" className="mb-1.5 block text-sm font-medium text-ink">{t.zipCode}</label>
            <input id="zip-code" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, ""))} required placeholder={t.zipPlaceholder} className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20" />
          </div>
        </div>
        <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep">
          <IconSearch />{t.findResources}
        </button>
      </form>

      {results !== null && (
        <div className="mt-8">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-lavender-deep/30 bg-lavender-light/50 px-5 py-6 text-center">
              <p className="text-sm text-ink-muted">{t.noResults}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm font-medium text-ink-muted">{results.length} {results.length !== 1 ? t.resourcesFound : t.resourceFound}</p>
              <ul className="space-y-3">
                {results.map(r => (
                  <li key={r.name} className="rounded-2xl border border-lavender-deep/40 bg-cream-dark/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink">{r.name}</p>
                        <p className="mt-1 text-sm text-ink-muted">{r.description}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-lavender px-2.5 py-0.5 text-xs font-medium text-purple-deep">{regionLabel(r.tag)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      {r.phone && <a href={`tel:${r.phone.replace(/\D/g, "")}`} className="font-medium text-purple hover:text-purple-deep">{r.phone}</a>}
                      {r.url && <a href={r.url} className="font-medium text-purple hover:text-purple-deep">{t.visitWebsite}</a>}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Exhibit organizer ────────────────────────────────────────────────────────

type EvidenceItem = {
  id: number;
  label: string;
  notes: string;
  date: string;
  category: string;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
};

const EVIDENCE_CATEGORIES = ["Document", "Photo / Screenshot", "Text / Email", "Audio / Video", "Other"];

function ExhibitOrganizer({ t }: { t: typeof T["en"] }) {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [view, setView] = useState<"add" | "timeline">("add");
  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Document");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileType(file.type);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    if (!label) setLabel(file.name.replace(/\.[^.]+$/, ""));
  };

  const addItem = () => {
    if (!label.trim() && !fileUrl) return;
    setItems(prev => [...prev, {
      id: Date.now(),
      label: label || fileName || "Untitled",
      notes,
      date: date || new Date().toISOString().slice(0, 10),
      category,
      fileUrl,
      fileName,
      fileType,
    }]);
    setLabel(""); setNotes(""); setDate(""); setCategory("Document");
    setFileUrl(null); setFileName(null); setFileType(null);
    if (fileRef.current) fileRef.current.value = "";
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  const isImage = (type: string | null) => type?.startsWith("image/") ?? false;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">Upload photos, screenshots, documents, and evidence. We organize everything into a timeline for you.</p>

      {/* View toggle */}
      <div className="flex gap-2">
        <button onClick={() => setView("add")} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === "add" ? "bg-purple text-cream" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}>+ Add Evidence</button>
        <button onClick={() => setView("timeline")} className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${view === "timeline" ? "bg-purple text-cream" : "bg-lavender-light text-ink-muted hover:bg-lavender"}`}>
          📅 Timeline {items.length > 0 && <span className="ml-1 rounded-full bg-purple-soft/30 px-1.5 text-xs">{items.length}</span>}
        </button>
      </div>

      {/* Add form */}
      {view === "add" && (
        <div className="rounded-2xl border border-lavender-deep/40 bg-cream-dark/60 p-5 space-y-3">
          {/* File upload drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple/30 bg-lavender-light/50 px-4 py-6 text-center transition hover:border-purple/60 hover:bg-lavender-light"
          >
            {fileUrl && isImage(fileType) ? (
              <img src={fileUrl} alt={fileName ?? ""} className="max-h-40 rounded-xl object-contain shadow" />
            ) : fileUrl ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">📄</span>
                <p className="text-sm font-medium text-ink">{fileName}</p>
              </div>
            ) : (
              <>
                <span className="text-4xl">📎</span>
                <p className="text-sm font-semibold text-ink">Tap to upload a photo, screenshot, or file</p>
                <p className="text-xs text-ink-muted">Images, PDFs, documents, audio, video</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*,application/pdf,.doc,.docx,.txt,audio/*,video/*" className="hidden" onChange={handleFile} />

          <input
            type="text"
            placeholder="Label (e.g. CPS letter received, Text from school)"
            value={label}
            onChange={e => setLabel(e.target.value)}
            className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Date of incident/document</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-3 py-2 text-sm text-ink focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-3 py-2 text-sm text-ink focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20">
                {EVIDENCE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <textarea
            rows={2}
            placeholder="Notes: Who, what, where, when. What does this prove?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full resize-none rounded-xl border border-lavender-deep/60 bg-cream px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20"
          />

          <button
            type="button"
            onClick={addItem}
            disabled={!label.trim() && !fileUrl}
            className="w-full rounded-full bg-purple py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep disabled:opacity-40"
          >
            {saved ? "✓ Added to Timeline" : "Add to Evidence Timeline"}
          </button>
        </div>
      )}

      {/* Timeline view */}
      {view === "timeline" && (
        <div>
          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-lavender-deep/30 bg-lavender-light/50 py-10 text-center">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-sm text-ink-muted">No evidence added yet. Tap Add Evidence to get started.</p>
            </div>
          ) : (
            <div className="relative space-y-0">
              {/* Vertical line */}
              <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-lavender-deep/40" />
              {sorted.map((item, i) => (
                <div key={item.id} className="relative flex gap-4 pb-5">
                  {/* Dot */}
                  <div className="relative z-10 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple text-sm font-bold text-cream shadow">
                    {i + 1}
                  </div>
                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-lavender-deep/30 bg-white/80 p-4 shadow-sm">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-ink">{item.label}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-purple/10 px-2 py-0.5 text-xs font-medium text-purple-deep">{item.date}</span>
                          <span className="rounded-full bg-lavender-light px-2 py-0.5 text-xs font-medium text-ink-muted">{item.category}</span>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="shrink-0 text-xs text-ink-muted hover:text-purple">✕</button>
                    </div>
                    {item.fileUrl && isImage(item.fileType) && (
                      <img src={item.fileUrl} alt={item.fileName ?? ""} className="mb-2 max-h-32 rounded-xl object-contain" />
                    )}
                    {item.fileUrl && !isImage(item.fileType) && (
                      <p className="mb-2 text-xs text-ink-muted">📄 {item.fileName}</p>
                    )}
                    {item.notes && <p className="text-sm text-ink-muted">{item.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-lavender-deep/20 bg-lavender-light/50 px-4 py-3 text-xs text-ink-muted">
        <strong className="text-ink">Privacy:</strong> All files stay on your device and are never uploaded to any server. Clear your browser to remove them.
      </div>
    </div>
  );
}

// ─── Form assistant ───────────────────────────────────────────────────────────

function FormAssistant({ t }: { t: typeof T["en"] }) {
  const [state, setState] = useState("CA");
  const [form, setForm] = useState("");
  const [situation, setSituation] = useState("");
  const [guidance, setGuidance] = useState<FormGuidance | null>(null);
  const [loading, setLoading] = useState(false);

  const forms = FORMS_BY_STATE[state] ?? FORMS_BY_STATE.CA;

  const generate = () => {
    if (!form || !situation.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const formType = form as keyof typeof SECTIONS_BY_TYPE;
      const label = forms.find(f => f.value === form)?.label ?? form;
      const stateName = STATES.find(s => s.value === state)?.label ?? state;
      setGuidance({
        formLabel: label,
        state: stateName,
        situation: situation.trim(),
        sections: SECTIONS_BY_TYPE[formType] ?? [],
        tip: "Bring 3 copies to the courthouse — one is filed, one is served, one stays with you. The Self-Help Center can review your completed form for free.",
      });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">{t.formsSubtitle}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">State</label>
          <select value={state} onChange={e => { setState(e.target.value); setForm(""); setGuidance(null); }} className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-sm text-ink focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20">
            {STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">{t.whichForm}</label>
          <select value={form} onChange={e => { setForm(e.target.value); setGuidance(null); }} className="w-full rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-sm text-ink focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20">
            <option value="">{t.selectForm}</option>
            {forms.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">{t.describeYourSituation}</label>
        <textarea rows={3} value={situation} onChange={e => setSituation(e.target.value)} placeholder={t.situationPlaceholder} className="w-full resize-none rounded-xl border border-lavender-deep/60 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-muted/50 focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/20" />
      </div>

      <button type="button" onClick={generate} disabled={!form || !situation.trim() || loading} className="rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-purple-deep disabled:opacity-50">
        {loading ? t.generating : t.getGuidance}
      </button>

      {guidance && (
        <div className="rounded-2xl border border-lavender-deep/40 bg-lavender-light/60 px-5 py-5 text-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-soft">{t.draftGuidance} — {guidance.state}</p>
          <p className="mb-4 text-base font-semibold text-ink">{guidance.formLabel}</p>
          <div className="mb-4 rounded-xl bg-cream/70 px-4 py-3 text-ink-muted">
            <span className="font-medium text-ink">{t.yourSituation} </span>{guidance.situation}
          </div>
          <p className="mb-3 font-medium text-ink">{t.sectionsToComplete}</p>
          <ol className="space-y-3">
            {guidance.sections.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple text-xs font-bold text-cream">{i + 1}</span>
                <div>
                  <p className="font-medium text-ink">{s.title}</p>
                  <p className="text-ink-muted">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex gap-2 rounded-xl border border-lavender-deep/30 bg-pastel-butter/60 px-4 py-3">
            <span className="text-base">💡</span>
            <p className="text-ink-muted">{guidance.tip}</p>
          </div>
          <p className="mt-4 text-xs text-ink-muted">This is general guidance only — not legal advice. A licensed attorney or Self-Help Center staff can review your completed form.</p>
        </div>
      )}
    </div>
  );
}

// ─── Rights content ───────────────────────────────────────────────────────────

const RIGHTS = [
  { emoji: "👨‍👩‍👧", title: "Custody Rights", body: "You have the right to seek legal custody (decision-making) and physical custody (where the child lives). Courts decide based on the best interest of the child. You can request a custody evaluation." },
  { emoji: "📋", title: "Right to Due Process", body: "You have the right to be notified of all court hearings and to respond to any petition filed against you. No order should be entered without you having the chance to be heard." },
  { emoji: "🛡️", title: "Rights During CPS Investigation", body: "You have the right to know why CPS is investigating, to have an attorney present during interviews, and to refuse entry without a court order — unless there is an emergency." },
  { emoji: "📚", title: "Your Child's Education Rights", body: "Your child has the right to a free public education regardless of custody status. You have the right to attend school meetings and access records, unless a court order says otherwise." },
  { emoji: "🏛️", title: "Right to Modify Orders", body: "If circumstances change significantly, you can petition the court to modify a custody or support order. You do not need to wait until the original order expires." },
  { emoji: "⚖️", title: "Right to Legal Representation", body: "You have the right to an attorney. If you cannot afford one, contact your local legal aid organization. Some family court hearings may qualify for court-appointed counsel." },
];

const GUIDES = [
  {
    title: "How to File for Custody",
    steps: [
      "Get the correct petition form for your state (see Common Court Forms tab).",
      "Fill out the form completely. Use the AI Form Assistant for guidance.",
      "File the form at your local family courthouse and pay the filing fee (fee waivers available).",
      "Serve the other parent with a copy of the filed papers.",
      "Attend your hearing. Bring copies of all documents and your exhibit list.",
    ],
  },
  {
    title: "How to Respond to a Petition Filed Against You",
    steps: [
      "Read the petition carefully. Note the response deadline (usually 30 days).",
      "Get the Response form for your state and fill it out.",
      "File your response at the courthouse before the deadline.",
      "Serve your response on the other party.",
      "Contact a legal aid organization immediately for help.",
    ],
  },
  {
    title: "How to Prepare for a Court Hearing",
    steps: [
      "Organize all documents: school records, medical records, communications, photos.",
      "Label each document as an Exhibit (A, B, C…) using the Document Organizer.",
      "Write a clear, factual statement of your situation. Stick to facts and dates.",
      "Arrive 30 minutes early. Dress neatly and bring 3 copies of everything.",
      "Speak directly to the judge. Be calm, respectful, and brief.",
    ],
  },
  {
    title: "How to Request a Fee Waiver",
    steps: [
      "Ask the clerk for a Fee Waiver Application (often called In Forma Pauperis).",
      "Fill out your income and expense information honestly.",
      "File the waiver at the same time as your main petition.",
      "The judge will approve or deny it — most low-income parents qualify.",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const LEGAL_TABS = [
  { id: "rights", label: "Understand Your Rights", emoji: "🛡️" },
  { id: "forms", label: "Common Court Forms", emoji: "📋" },
  { id: "guides", label: "Step-by-Step Guides", emoji: "🗺️" },
  { id: "resources", label: "Find Legal Help Near You", emoji: "📍" },
  { id: "documents", label: "Document Organizer", emoji: "🗂️" },
] as const;
type LegalTab = (typeof LEGAL_TABS)[number]["id"];

export default function LegalPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeTab, setActiveTab] = useState<LegalTab>("rights");
  const t = T[lang];

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-lavender/80 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-lavender-deep/40 blur-3xl" aria-hidden />

      {/* Header */}
      <header className="relative z-10 border-b border-lavender-deep/30 bg-cream/80 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-ink-muted hover:text-purple">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <BrandLogo size="sm" href="/dashboard" />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm sm:inline">🌐</span>
            <select value={lang} onChange={e => setLang(e.target.value as Lang)} aria-label="Language" className="rounded-xl border border-lavender-deep/50 bg-cream px-2 py-1.5 text-xs font-medium text-ink-muted focus:border-purple focus:outline-none">
              {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="relative z-10 border-b border-lavender-deep/20 bg-gradient-to-r from-lavender-light to-cream px-4 py-5">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-soft">{t.pageLabel}</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">{t.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {t.subtitle} <strong className="text-ink">{t.notLegalAdvice}</strong>
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="relative z-10 border-b border-lavender-deep/20 bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl overflow-x-auto">
          <div className="flex gap-1 px-4 py-2">
            {LEGAL_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${activeTab === tab.id ? "bg-purple text-cream shadow-sm" : "text-ink-muted hover:bg-lavender-light"}`}
              >
                <span>{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6">

        {/* Tab: Understand Your Rights */}
        {activeTab === "rights" && (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">Know your rights — in plain language. You have more power than you may realize.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {RIGHTS.map(r => (
                <div key={r.title} className="rounded-2xl border border-lavender-deep/30 bg-white/80 p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <p className="font-semibold text-ink">{r.title}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-muted">{r.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-2xl border border-lavender-deep/30 bg-lavender-light/60 px-4 py-3 text-sm text-ink-muted">
              <strong className="text-ink">Remember:</strong> Laws vary by state. For advice specific to your situation, always consult a licensed attorney or free legal aid in your area.
            </div>
          </div>
        )}

        {/* Tab: Common Court Forms */}
        {activeTab === "forms" && (
          <SectionCard id="forms" icon={<IconDoc />} title={t.formsTitle}>
            <FormAssistant t={t} />
          </SectionCard>
        )}

        {/* Tab: Step-by-Step Guides */}
        {activeTab === "guides" && (
          <div className="space-y-5">
            <p className="text-sm text-ink-muted">Plain-language guides for the most common family court situations.</p>
            {GUIDES.map(g => (
              <div key={g.title} className="rounded-2xl border border-lavender-deep/30 bg-white/80 p-5 shadow-sm">
                <p className="mb-4 font-bold text-ink">{g.title}</p>
                <ol className="space-y-3">
                  {g.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple text-xs font-bold text-cream">{i + 1}</span>
                      <p className="text-sm leading-relaxed text-ink-muted">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Find Legal Help Near You */}
        {activeTab === "resources" && (
          <SectionCard id="resources" icon={<IconScale />} title={t.resourcesTitle}>
            <ResourceFinder t={t} />
          </SectionCard>
        )}

        {/* Tab: Document Organizer */}
        {activeTab === "documents" && (
          <SectionCard id="documents" icon={<IconFolderOpen />} title={t.exhibitsTitle}>
            <ExhibitOrganizer t={t} />
          </SectionCard>
        )}

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-lavender-deep/30 bg-lavender-light/50 px-5 py-4 text-sm text-ink-muted">
          <strong className="font-semibold text-ink">{t.disclaimerTitle}</strong> {t.disclaimer}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
