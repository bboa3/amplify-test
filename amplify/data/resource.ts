import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';
import { addOrUpdateSearchableRecord } from '../functions/add-or-update-searchable-record/resource';
import { addUserToGroup } from '../functions/add-user-to-group/resource';
import { adminCreateUser } from '../functions/admin-create-user/resource';
import { createStreamToken } from '../functions/create-stream-token/resource';
import { deleteSearchableRecord } from '../functions/delete-searchable-record/resource';
import { supportContactEmail } from '../functions/support-contact-email/resource';

const addressOwnerType = ['BUSINESS', 'EVENT', 'USER'] as const;
const eventStatus = ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED'];
const eventTypes = ['WORKSHOPS', 'WEBINARS', 'CONFERENCES', 'SEMINARS', 'MEETUPS'];
const ratedItemType = ['BUSINESS', 'PROFESSIONAL', 'RESOURCE'] as const;
const remindedItemType = ['BUSINESS', 'PROFESSIONAL', 'RESOURCE'] as const;
const notificationType = ['GENERAL', 'PERSONAL', 'PROMOTIONAL', 'UPDATE'] as const;
const notificationRelatedItemType = ['ORDER', 'BUSINESS', 'PROFESSIONAL', 'RESOURCE', 'ARTICLE', 'OTHER'] as const;
const notificationStatus = ['PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ'] as const;
const notificationTemplateKey = [
  // === naming convention: [DOMAIN]_[ACTION]_[MODIFIER] ===

  // =========== Invoice ===========
  'INVOICE_CREATED',
  'INVOICE_STATUS_UPDATED',

  // ========== User Account ==========
  'USER_WELCOME',
  'USER_ACCOUNT_SECURITY_ALERT',

  // ========== Payments ==========
  'PAYMENT_RECEIVED',
  'PAYMENT_FAILED',

  // ========== Content & Promotions ==========
  'CONTENT_ARTICLE_PUBLISHED',
  'PROMOTION_SERVICE_LAUNCH',
  'PROMOTION_COMMUNITY_EVENT'
] as const;
const likedItemType = ['BUSINESS', 'ARTICLE', 'RESOURCE'] as const;
const viewedItemType = ['BUSINESS', 'PROFESSIONAL', 'ARTICLE', 'RESOURCE'] as const;
const gender = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'];
const priority = ['LOW', 'MEDIUM', 'HIGH']
const reminderStatus = ['PENDING', 'COMPLETED', 'SKIPPED']
const repeatType = ['NONE', 'DAILY', 'WEEKLY', 'CUSTOM']
const userBusinessRole = ['ADMIN', 'MANAGER', 'EMPLOYEE']
const messageType = ['TEXT', 'IMAGE', 'DOCUMENT']
const messageStatus = ['SENT', 'DELIVERED', 'READ', 'FAILED', 'RECALLED'];
const messageMediaType = ['IMAGE', 'DOCUMENT']
const orderStatus = ['PENDING', 'FULFILLED', 'CANCELLED', 'REJECTED'];
const invoiceStatus = ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'];
const paymentTermsType = ['NET_1', 'NET_7', 'NET_30'];
const paymentMethodType = ['CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_PAYMENT'];
const cardBrand = ['MASTERCARD', 'VISA'];
const mobileProviderName = ['M_PESA', 'E_MOLA', 'M_KESH'];
const resourceItemStatus = ['PENDING', 'ACTIVE', 'CANCELLED', 'REFUNDED', 'EXPIRED', 'FAILED', 'SUSPENDED'];
const eventRegistrationStatus = ['PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED', 'CHECKED_IN', 'NO_SHOW', 'EXPIRED'];
const conversationParticipantRole = ['ADMIN', 'MODERATOR', 'MEMBER'];
const userRoles = ['ADMIN', 'PROFESSIONAL', 'SUBSCRIBER'] as const;
const articleStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
const mediaTypes = ['IMAGE', 'VIDEO'] as const;
const categoryTypes = ['ARTICLE', 'BUSINESS', 'EVENT', 'RESOURCE', 'OPPORTUNITY'] as const;
const paymentTransactionStatus = ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'];
const invoiceSourceType = ['RESOURCE_ORDER', 'EVENT_ORDER'] as const;
const opportunityTypes = ['COMPETITION', 'VACANCY', 'SCHOLARSHIP', 'FUND'] as const;
const opportunityStatus = ['DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED'] as const;

const schema = a.schema({
  addUserToGroup: a
    .mutation()
    .arguments({
      authId: a.string().required(),
      groupName: a.string().required(),
    })
    .returns(a.customType({
      content: a.string()
    }))
    .handler(a.handler.function(addUserToGroup))
    .authorization((allow) => [allow.authenticated()]),
  adminCreateUser: a
    .mutation()
    .arguments({
      email: a.string().required(),
      password: a.string().required(),
    })
    .authorization((allow) => [allow.group('ADMIN')])
    .handler(a.handler.function(adminCreateUser))
    .returns(a.customType({
      content: a.string()
    })),

  addOrUpdateSearchableRecord: a
    .mutation()
    .arguments({
      indexName: a.string().required(),
      objectID: a.string().required(),
      body: a.json().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(addOrUpdateSearchableRecord))
    .returns(a.customType({
      content: a.string()
    })),

  deleteSearchableRecord: a
    .mutation()
    .arguments({
      indexName: a.string().required(),
      objectID: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(deleteSearchableRecord))
    .returns(a.customType({
      content: a.string()
    })),

  createStreamToken: a
    .mutation()
    .arguments({
      userId: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(createStreamToken))
    .returns(a.customType({
      content: a.string()
    })),

  supportContactEmail: a
    .mutation()
    .arguments({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      reason: a.string().required(),
      subject: a.string(),
      message: a.string().required(),
    })
    .authorization((allow) => [allow.guest()])
    .handler(a.handler.function(supportContactEmail))
    .returns(a.customType({
      content: a.string()
    })),

  user: a.model({
    authId: a.string().required(),
    email: a.string().required(),
    name: a.string(),
    phone: a.string(),
    role: a.enum(userRoles),
    gender: a.enum(gender),
    dateOfBirth: a.datetime(),
    lastLogin: a.datetime(),
    profilePicture: a.string(),
    bio: a.string(),
    pushTokens: a.string().required().array(),
    isDeleted: a.boolean().required().default(false),
    articles: a.hasMany('article', 'authorId'),
    likes: a.hasMany('like', 'ownerId'),
    views: a.hasMany('view', 'ownerId'),
    address: a.hasOne('address', 'addressOwnerId'),
    professional: a.hasOne('professional', 'ownerId'),
    ratings: a.hasMany('rating', 'ownerId'),
    eventRegistrations: a.hasMany('eventRegistration', 'ownerId'),
    reminders: a.hasMany('reminder', 'ownerId'),
    businessStaffs: a.hasMany('businessStaff', 'ownerId'),
    resourceOrders: a.hasMany('resourceOrder', 'ownerId'),
    resourceOrderItems: a.hasMany('resourceOrderItem', 'ownerId'),
    paymentMethods: a.hasMany('paymentMethod', 'ownerId'),
    invoices: a.hasMany('invoice', 'ownerId'),
    eventOrders: a.hasMany('eventOrder', 'ownerId'),
  }).identifier(['authId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.ownerDefinedIn('authId').to(['create', 'read', 'update']),
      allow.groups(['ADMIN']).to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions']),

  article: a.model({
    id: a.id().required(),
    title: a.string().required(),
    slug: a.string().required(),
    excerpt: a.string(),
    authorId: a.id().required(),
    status: a.enum(articleStatuses),
    tags: a.string().required().array().required(),
    publishedAt: a.datetime().required(),
    viewCount: a.integer().required().default(0),
    likeCount: a.integer().required().default(0),
    isDeleted: a.boolean().default(false),
    featuredImage: a.hasOne('media', 'articleId'),
    author: a.belongsTo('user', 'authorId'),
    contentBlocks: a.hasMany('contentBlock', 'articleId'),
    categories: a.hasMany('articleCategory', 'articleId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]),

  contentBlock: a.model({
    id: a.id().required(),
    articleId: a.id().required(),
    title: a.string(),
    content: a.string().required(),
    order: a.integer().required(),
    article: a.belongsTo('article', 'articleId'),
    medias: a.hasMany('media', 'contentBlockId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  media: a.model({
    id: a.id().required(),
    url: a.string().required(),
    thumbnailUrl: a.string(),
    type: a.enum(mediaTypes),
    fileSize: a.integer(),
    mimeType: a.string(),
    articleId: a.id(),
    contentBlockId: a.id(),
    article: a.belongsTo('article', 'articleId'),
    contentBlock: a.belongsTo('contentBlock', 'contentBlockId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  category: a.model({
    id: a.id().required(),
    type: a.enum(categoryTypes),
    name: a.string().required(),
    slug: a.string().required(),
    description: a.string(),
    isDeleted: a.boolean().required().default(false),
    subCategories: a.string().required().array(),
    articles: a.hasMany('articleCategory', 'categoryId'),
    resources: a.hasMany('resourceCategory', 'categoryId'),
    business: a.hasMany('businessCategory', 'categoryId'),
  }).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions', 'delete']),

  articleCategory: a.model({
    id: a.id().required(),
    articleId: a.id().required(),
    categoryId: a.id().required(),
    article: a.belongsTo('article', 'articleId'),
    category: a.belongsTo('category', 'categoryId'),
  }).identifier(['articleId', 'categoryId']).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN']).to(['create', 'read', 'delete']),
  ]).disableOperations(['update']),

  resourceCategory: a.model({
    id: a.id().required(),
    resourceId: a.id().required(),
    categoryId: a.id().required(),
    resource: a.belongsTo('resource', 'resourceId'),
    category: a.belongsTo('category', 'categoryId'),
  }).identifier(['resourceId', 'categoryId']).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'delete']),
  ]).disableOperations(['update']),

  businessCategory: a.model({
    id: a.id().required(),
    businessId: a.id().required(),
    categoryId: a.id().required(),
    business: a.belongsTo('business', 'businessId'),
    category: a.belongsTo('category', 'categoryId'),
  }).identifier(['businessId', 'categoryId']).authorization(allow => [
    allow.guest().to(['read']),
    allow.authenticated().to(['read']),
    allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'delete']),
  ]).disableOperations(['update']),

  address: a.model({
    addressOwnerId: a.id().required(),
    addressOwnerType: a.enum(addressOwnerType),
    addressLine1: a.string().required(),
    neighborhoodOrDistrict: a.string().required(),
    city: a.string().required(),
    province: a.string().required(),
    postalCode: a.string(),
    country: a.string().required(),
    latitude: a.float(),
    longitude: a.float(),
    user: a.belongsTo('user', 'addressOwnerId'),
    business: a.belongsTo('business', 'addressOwnerId'),
    event: a.belongsTo('event', 'addressOwnerId'),
  })
    .identifier(['addressOwnerId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions']),

  professional: a.model({
    ownerId: a.id().required(),
    professionalRegistrationNumber: a.string().required(),
    name: a.string().required(),
    bio: a.string().required(),
    profession: a.string().required(),
    contactEmail: a.string().required(),
    contactPhone: a.string().required(),
    website: a.string(),
    skills: a.string().required().array().required(),
    profilePictureUrl: a.string().required(),
    availableForWork: a.boolean().default(true),
    socialLinks: a.customType({
      linkedin: a.string(),
      twitter: a.string(),
      facebook: a.string(),
      instagram: a.string(),
    }),
    certifications: a.hasMany('certification', 'professionalId'),
    careerHistories: a.hasMany('career', 'professionalId'),
    educationHistories: a.hasMany('education', 'professionalId'),
    projects: a.hasMany('project', 'professionalId'),
    ratings: a.hasMany('rating', 'ratedItemId'),
    uploadedResources: a.hasMany('resource', 'professionalId'),
    user: a.belongsTo('user', 'ownerId'),
    opportunities: a.hasMany('opportunity', 'createdById'),
  }).identifier(['ownerId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions']),

  career: a.model({
    id: a.id().required(),
    professionalId: a.id().required(),
    companyName: a.string().required(),
    jobTitle: a.string().required(),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    description: a.string(),
    professional: a.belongsTo('professional', 'professionalId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  education: a.model({
    id: a.id().required(),
    professionalId: a.id().required(),
    institutionName: a.string().required(),
    degree: a.string().required(),
    fieldOfStudy: a.string().required(),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    description: a.string(),
    professional: a.belongsTo('professional', 'professionalId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  project: a.model({
    id: a.id().required(),
    professionalId: a.id().required(),
    projectName: a.string().required(),
    description: a.string(),
    projectUrl: a.string(),
    startDate: a.datetime().required(),
    endDate: a.datetime(),
    professional: a.belongsTo('professional', 'professionalId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  certification: a.model({
    id: a.id().required(),
    issuedBy: a.string().required(),
    name: a.string().required(),
    description: a.string(),
    professionalId: a.id(),
    businessId: a.id(),
    professional: a.belongsTo('professional', 'professionalId'),
    business: a.belongsTo('business', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  business: a.model({
    id: a.id().required(),
    businessRegistrationNumber: a.string().required(),
    uniqueTaxIdentificationNumber: a.string().required(),
    name: a.string().required(),
    description: a.string().required(),
    contactEmail: a.string().required(),
    contactPhone: a.string().required(),
    website: a.string(),
    logoUrl: a.string().required(),
    establishedDate: a.datetime(),
    employeeCount: a.integer(),
    revenue: a.float(),
    likes: a.integer().required(),
    socialLinks: a.customType({
      linkedin: a.string(),
      twitter: a.string(),
      facebook: a.string(),
      instagram: a.string()
    }),
    isPublished: a.boolean().required(),
    address: a.hasOne('address', 'addressOwnerId'),
    certifications: a.hasMany('certification', 'businessId'),
    licenses: a.hasMany('license', 'businessId'),
    businessOpeningHour: a.hasOne('businessOpeningHour', 'businessId'),
    businessStaffs: a.hasMany('businessStaff', 'businessId'),
    ratings: a.hasMany('rating', 'ratedItemId'),
    event: a.hasMany('event', 'businessId'),
    categories: a.hasMany('businessCategory', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  businessStaff: a.model({
    id: a.id().required(),
    ownerId: a.id().required(),
    businessId: a.id().required(),
    role: a.enum(userBusinessRole),
    user: a.belongsTo('user', 'ownerId'),
    business: a.belongsTo('business', 'businessId')
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'update', 'delete'])
    ]),

  license: a.model({
    id: a.id().required(),
    issuedBy: a.string().required(),
    licenseNumber: a.string().required(),
    issueDate: a.datetime().required(),
    expiryDate: a.datetime(),
    description: a.string(),
    businessId: a.id().required(),
    business: a.belongsTo('business', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  businessOpeningHour: a.model({
    id: a.id().required(),
    businessId: a.id().required(),
    regularOpeningHours: a.hasMany('businessRegularOpeningHour', 'businessOpeningHourId'),
    specialOpeningHours: a.hasMany('businessSpecialOpeningHour', 'businessOpeningHourId'),
    business: a.belongsTo('business', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  businessRegularOpeningHour: a.model({
    id: a.id().required(),
    dayOfWeek: a.integer().required(),
    timeRange: a.customType({
      openingTime: a.string().required(),
      closingTime: a.string().required(),
    }),
    isClosed: a.boolean().required().default(false),
    is24Hours: a.boolean().required().default(false),
    businessOpeningHourId: a.id().required(),
    businessOpeningHour: a.belongsTo('businessOpeningHour', 'businessOpeningHourId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  businessSpecialOpeningHour: a.model({
    id: a.id().required(),
    date: a.date().required(),
    timeRange: a.customType({
      openingTime: a.string().required(),
      closingTime: a.string().required(),
    }),
    isClosed: a.boolean().required().default(false),
    is24Hours: a.boolean().required().default(false),
    businessOpeningHourId: a.id().required(),
    businessOpeningHour: a.belongsTo('businessOpeningHour', 'businessOpeningHourId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  event: a.model({
    id: a.id().required(),
    title: a.string().required(),
    description: a.string().required(),
    type: a.enum(eventTypes),
    tags: a.string().required().array().required(),
    date: a.date().required(),
    time: a.string().required(),
    isVirtual: a.boolean().required(),
    virtualLink: a.string(),
    location: a.string().required(),
    capacity: a.integer().required(),
    ticketsAvailable: a.integer().required(),
    price: a.float().required(),
    businessId: a.id().required(),
    images: a.string().required().array().required(),
    status: a.enum(eventStatus),
    address: a.hasOne('address', 'addressOwnerId'),
    registrations: a.hasMany('eventRegistration', 'eventId'),
    organizer: a.belongsTo('business', 'businessId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  eventRegistration: a.model({
    id: a.id().required(),
    eventId: a.id().required(),
    ownerId: a.id().required(),
    orderId: a.id().required(),
    registeredAt: a.datetime().required(),
    ticketId: a.string().required(),
    description: a.string(),
    price: a.float().required(),
    status: a.enum(eventRegistrationStatus),
    event: a.belongsTo('event', 'eventId'),
    user: a.belongsTo('user', 'ownerId'),
    eventOrder: a.belongsTo('eventOrder', 'orderId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  resource: a.model({
    id: a.id().required(),
    professionalId: a.id().required(),
    authorName: a.string().required(),
    title: a.string().required(),
    description: a.string().required(),
    contentUrl: a.string().required(),
    imageUrl: a.string().required(),
    price: a.float().required(),
    downloadCount: a.integer().required(),
    isPublished: a.boolean().required(),
    likes: a.integer().required(),
    uploadAt: a.datetime().required(),
    uploadedBy: a.belongsTo('professional', 'professionalId'),
    ratings: a.hasMany('rating', 'ratedItemId'),
    resourceOrderItems: a.hasMany('resourceOrderItem', 'resourceId'),
    categories: a.hasMany('resourceCategory', 'resourceId'),
  })
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'create', 'update']),
    ]),

  opportunity: a.model({
    id: a.id().required(),
    image: a.string(),
    title: a.string().required(),
    description: a.string().required(),
    type: a.enum(opportunityTypes),
    status: a.enum(opportunityStatus),
    applicationDeadline: a.datetime().required(),
    postedDate: a.datetime().required(),
    eligibilityCriteria: a.string(),
    benefits: a.string(),
    applicationLink: a.string().required(),
    contactEmail: a.string().required(),
    contactPhone: a.string().required(),
    organization: a.string(),
    createdById: a.id().required(),
    tags: a.string().array(),
    professional: a.belongsTo('professional', 'createdById'),
  })
    .authorization(allow => [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      allow.ownerDefinedIn('createdById').to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
    ]).disableOperations(['subscriptions']),

  notification: a.model({
    id: a.id().required(),
    userId: a.id().required(),
    title: a.string(),
    shortMessage: a.string(),
    message: a.string(),
    templateKey: a.enum(notificationTemplateKey),
    templateData: a.json().required(),
    type: a.enum(notificationType),
    priority: a.enum(priority),
    bypassPreferences: a.boolean().default(false),
    relatedItemId: a.id(),
    relatedItemType: a.enum(notificationRelatedItemType),
    payload: a.customType({
      href: a.string(),
      actionData: a.json()
    }),
    channels: a.json().required(), // [{type: string, targets: string[]}]
    status: a.enum(notificationStatus),
    isInAppEnabled: a.boolean().default(false),
    sentAt: a.datetime(),
    deliveredAt: a.datetime(),
    deliveryAttempts: a.integer().default(0),
    lastAttemptError: a.string(),
    createdBy: a.string(),
  }).authorization(allow => [
    allow.authenticated().to(['read', 'update']),
    allow.groups(['ADMIN', 'PROFESSIONAL']).to(['create', 'read', 'update', 'delete']),
  ]).disableOperations(['subscriptions']),

  view: a.model({
    id: a.id().required(),
    ownerId: a.id(),
    identityId: a.string(),
    viewedItemId: a.id().required(),
    viewedItemType: a.enum(viewedItemType),
    timestamp: a.datetime().required(),
    user: a.belongsTo('user', 'ownerId'),
  }).identifier(['viewedItemId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
    ]).disableOperations(['subscriptions', 'update', 'delete']),

  like: a.model({
    id: a.id().required(),
    ownerId: a.id().required(),
    likedItemId: a.id().required(),
    likedItemType: a.enum(likedItemType),
    user: a.belongsTo('user', 'ownerId'),
  }).identifier(['likedItemId', 'ownerId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'delete']),
    ]).disableOperations(['subscriptions', 'update']),

  rating: a.model({
    id: a.id().required(),
    ownerId: a.id().required(),
    ratedItemId: a.id().required(),
    ratedItemType: a.enum(ratedItemType),
    rating: a.integer().required(),
    comment: a.string(),
    verifiedPurchase: a.boolean().required().default(false),
    responseComment: a.string(),
    responseCreatedAt: a.datetime(),
    business: a.belongsTo('business', 'ratedItemId'),
    professional: a.belongsTo('professional', 'ratedItemId'),
    resource: a.belongsTo('resource', 'ratedItemId'),
    user: a.belongsTo('user', 'ownerId'),
  })
    .identifier(['ratedItemId', 'ownerId'])
    .authorization(allow => [
      allow.authenticated().to(['read']),
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.group('ADMIN').to(['read', 'create', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  reminder: a.model({
    id: a.id().required(),
    ownerId: a.id().required(),
    remindedItemId: a.id().required(),
    remindedItemType: a.enum(remindedItemType),
    title: a.string().required(),
    message: a.string().required(),
    dateTime: a.datetime().required(),
    status: a.enum(reminderStatus),
    repeat: a.enum(repeatType),
    user: a.belongsTo('user', 'ownerId'),
  })
    .identifier(['remindedItemId', 'ownerId'])
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update', 'create', 'delete']),
    ]),

  // chatMessage: a.model({
  //   id: a.id().required(),
  //   conversationId: a.id().required(),
  //   senderParticipantId: a.id().required(),
  //   messageType: a.enum(messageType),
  //   textContent: a.string(),
  //   sentAt: a.datetime(),
  //   media: a.hasMany('media', 'chatMessageId'),
  //   conversation: a.belongsTo('conversation', 'conversationId'),
  //   senderParticipant: a.belongsTo('conversationParticipant', 'senderParticipantId'),
  //   messageRecipients: a.hasMany('chatMessageRecipient', 'chatMessageId'),
  //   pinnedMessages: a.hasMany('pinnedMessage', 'chatMessageId')
  // })
  //   .authorization(allow => [
  //     allow.authenticated().to(['read', "create", "update"])
  //   ]),

  // chatMessageRecipient: a.model({
  //   id: a.id().required(),
  //   chatMessageId: a.id().required(),
  //   conversationParticipantId: a.id().required(),
  //   status: a.enum(messageStatus),
  //   sentAt: a.datetime(),
  //   deliveredTimestamp: a.datetime(),
  //   readTimestamp: a.datetime(),
  //   chatMessage: a.belongsTo('chatMessage', 'chatMessageId'),
  //   conversationParticipant: a.belongsTo('conversationParticipant', 'conversationParticipantId'),
  // })
  //   .authorization((allow) => [
  //     allow.authenticated().to(['read', 'create', 'update']),
  //   ]),

  // conversationParticipant: a.model({
  //   id: a.id().required(),
  //   ownerId: a.id().required(),
  //   name: a.string().required(),
  //   avatarUrl: a.string(),
  //   businessId: a.id(),
  //   conversationId: a.id().required(),
  //   role: a.enum(conversationParticipantRole),
  //   lastReadTimestamp: a.datetime(),
  //   isActive: a.boolean().required().default(true),
  //   conversation: a.belongsTo('conversation', 'conversationId'),
  //   sentMessages: a.hasMany('chatMessage', 'senderParticipantId'),
  //   chatMessageRecipients: a.hasMany('chatMessageRecipient', 'conversationParticipantId'),
  //   user: a.belongsTo('user', 'ownerId'),
  //   business: a.belongsTo('business', 'businessId'),
  //   pinnedMessages: a.hasMany('pinnedMessage', 'conversationParticipantId'),
  // })
  //   .authorization(allow => [
  //     allow.authenticated().to(['read', 'create', 'update']),
  //   ]),

  // conversation: a.model({
  //   id: a.id().required(),
  //   lastMessageParticipantSenderId: a.id(),
  //   lastMessageSummary: a.string(),
  //   lastMessageSentAt: a.datetime(),
  //   title: a.string(),
  //   isGroup: a.boolean().required().default(false),
  //   groupAvatarUrl: a.string(),
  //   conversationParticipants: a.hasMany('conversationParticipant', 'conversationId'),
  //   chatMessages: a.hasMany('chatMessage', 'conversationId'),
  // })
  //   .authorization(allow => [
  //     allow.authenticated().to(['read', 'create', 'update'])
  //   ]),

  // pinnedMessage: a.model({
  //   id: a.id().required(),
  //   conversationParticipantId: a.id().required(),
  //   chatMessageId: a.id().required(),
  //   pinnedAt: a.datetime().required(),
  //   conversationParticipant: a.belongsTo('conversationParticipant', 'conversationParticipantId'),
  //   chatMessage: a.belongsTo('chatMessage', 'chatMessageId'),
  // })
  //   .authorization((allow) => [
  //     allow.authenticated().to(['read', 'create', 'delete']),
  //   ]),

  invoice: a.model({
    id: a.id().required(),
    invoiceNumber: a.string().required(),
    ownerId: a.id().required(),
    invoiceSourceType: a.enum(invoiceSourceType),
    invoiceSourceId: a.id().required(),
    subTotal: a.float().required(),
    discount: a.float().required(),
    taxes: a.float().required(),
    totalAmount: a.float().required(),
    paymentTerms: a.enum(paymentTermsType),
    dueDate: a.datetime().required(),
    status: a.enum(invoiceStatus),
    documentUrl: a.string(),
    documentVersion: a.integer(),
    documentHistory: a.json().array(),
    user: a.belongsTo('user', 'ownerId'),
    resourceOrder: a.belongsTo('resourceOrder', 'invoiceSourceId'),
    eventOrder: a.belongsTo('eventOrder', 'invoiceSourceId'),
    transactions: a.hasMany('paymentTransaction', 'invoiceId'),
  })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update', 'delete']),
    ]).disableOperations(['subscriptions', 'delete']),

  paymentTransaction: a.model({
    id: a.id().required(),
    invoiceId: a.id().required(),
    paymentMethodId: a.id().required(),
    transactionID: a.string(),
    amount: a.float().required(),
    transactionDate: a.datetime().required(),
    status: a.enum(paymentTransactionStatus),
    notes: a.string(),
    invoice: a.belongsTo('invoice', 'invoiceId'),
    paymentMethod: a.belongsTo('paymentMethod', 'paymentMethodId'),
  })
    .authorization(allow => [
      allow.owner().to(['read', 'create', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  paymentMethod: a.model({
    id: a.id().required(),
    ownerId: a.id().required(),
    ownerName: a.string().required(),
    type: a.enum(paymentMethodType),
    paymentToken: a.string().required(), // Token or reference ID
    isDefault: a.boolean().required(),
    cardDetails: a.customType({
      cardBrand: a.enum(cardBrand),
      lastFourDigits: a.string().required(),
    }),
    mobileDetails: a.customType({
      mobileNumber: a.string().required(),
      mobileProviderName: a.enum(mobileProviderName),
    }),
    user: a.belongsTo('user', 'ownerId'),
    transactions: a.hasMany('paymentTransaction', 'paymentMethodId'),
    resourceOrders: a.hasMany('resourceOrder', 'paymentMethodId'),
    eventOrders: a.hasMany('eventOrder', 'paymentMethodId'),
  })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  resourceOrderItem: a.model({
    id: a.id().required(),
    ownerId: a.id().required(),
    orderId: a.id().required(),
    resourceId: a.id().required(),
    description: a.string().required(),
    quantity: a.integer().required(),
    price: a.float().required(),
    status: a.enum(resourceItemStatus),
    user: a.belongsTo('user', 'ownerId'),
    order: a.belongsTo('resourceOrder', 'orderId'),
    resource: a.belongsTo('resource', 'resourceId'),
  })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update']),
    ]).disableOperations(['subscriptions', 'delete']),

  resourceOrder: a.model({
    id: a.id().required(),
    orderNumber: a.string().required(),
    ownerId: a.id().required(),
    paymentMethodId: a.id().required(),
    status: a.enum(orderStatus),
    user: a.belongsTo('user', 'ownerId'),
    invoices: a.hasMany('invoice', 'invoiceSourceId'),
    items: a.hasMany('resourceOrderItem', 'orderId'),
    paymentMethod: a.belongsTo('paymentMethod', 'paymentMethodId')
  })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update']),
    ]),

  eventOrder: a.model({
    id: a.id().required(),
    orderNumber: a.string().required(),
    ownerId: a.id().required(),
    paymentMethodId: a.id().required(),
    status: a.enum(orderStatus),
    user: a.belongsTo('user', 'ownerId'),
    invoices: a.hasMany('invoice', 'invoiceSourceId'),
    items: a.hasMany('eventRegistration', 'orderId'),
    paymentMethod: a.belongsTo('paymentMethod', 'paymentMethodId'),
  })
    .authorization(allow => [
      allow.owner().to(['create', 'read', 'update']),
      allow.groups(['ADMIN', 'PROFESSIONAL']).to(['read', 'update']),
    ]),
})
  .authorization((allow) => [allow.resource(postConfirmation)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});