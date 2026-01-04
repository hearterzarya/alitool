module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/growtools/client/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/Desktop/growtools/client/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable",
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
// Handle connection errors gracefully
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
    // Test connection on startup in development
    if ("TURBOPACK compile-time truthy", 1) {
        prisma.$connect().catch((error)=>{
            console.error('❌ Database connection failed:', error.message);
            console.error('💡 Make sure DATABASE_URL is set in your .env.local file');
            console.error('💡 Run: npm run db:push to create database tables');
        });
    }
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/Desktop/growtools/client/src/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/growtools/client/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/growtools/client/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/growtools/client/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function POST(req) {
    try {
        const { email, password, name } = await req.json();
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email and password are required"
            }, {
                status: 400
            });
        }
        // Check database connection first
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$connect();
        } catch (dbError) {
            console.error("Database connection error:", dbError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database connection failed. Please check your DATABASE_URL environment variable and ensure the database is running.",
                details: ("TURBOPACK compile-time truthy", 1) ? dbError.message : "TURBOPACK unreachable"
            }, {
                status: 503
            });
        }
        // Check if user already exists
        let existingUser;
        try {
            existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                where: {
                    email
                }
            });
        } catch (prismaError) {
            console.error("Prisma query error:", prismaError);
            // Handle specific Prisma errors
            if (prismaError.code === 'P2024') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Database connection timed out. Please check your database connection and try again.",
                    details: ("TURBOPACK compile-time truthy", 1) ? "P2024: Connection timeout" : "TURBOPACK unreachable"
                }, {
                    status: 503
                });
            }
            if (prismaError.code === 'P2021') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Database tables not found. Please run 'npm run db:push' to create the database schema.",
                    details: ("TURBOPACK compile-time truthy", 1) ? "P2021: Table does not exist" : "TURBOPACK unreachable"
                }, {
                    status: 503
                });
            }
            throw prismaError;
        }
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User already exists"
            }, {
                status: 400
            });
        }
        // Hash password
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(password, 10);
        // Create user
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.create({
            data: {
                email,
                name: name || null,
                passwordHash: hashedPassword
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }, {
            status: 201
        });
    } catch (error) {
        console.error("Registration error:", error);
        // Handle Prisma errors
        if (error.code === 'P2024') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database connection timed out. Please check your database connection.",
                details: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable"
            }, {
                status: 503
            });
        }
        if (error.code === 'P2021') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database tables not found. Please run database migrations.",
                details: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable"
            }, {
                status: 503
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Something went wrong",
            details: ("TURBOPACK compile-time truthy", 1) ? error.message : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    } finally{
        // Disconnect Prisma to avoid connection pool issues
        await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$growtools$2f$client$2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$disconnect().catch(()=>{});
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__53088c4e._.js.map