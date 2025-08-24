# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

# Create Next.js app
RUN npx --yes create-next-app@15.5.0 . --yes

# Install Motion Primitives dependencies
RUN npm install motion clsx tailwind-merge lucide-react

# Install Better Auth dependencies
RUN npm install next-auth @auth/prisma-adapter prisma @prisma/client bcryptjs
RUN npm install --save-dev @types/bcryptjs

# Install all available Motion Primitives components
RUN npx motion-primitives@latest add accordion
RUN npx motion-primitives@latest add animated-background
RUN npx motion-primitives@latest add animated-group
RUN npx motion-primitives@latest add border-trail
RUN npx motion-primitives@latest add carousel
RUN npx motion-primitives@latest add cursor
RUN npx motion-primitives@latest add dialog
RUN npx motion-primitives@latest add disclosure
RUN npx motion-primitives@latest add in-view
RUN npx motion-primitives@latest add infinite-slider
RUN npx motion-primitives@latest add transition-panel
RUN npx motion-primitives@latest add text-effect
RUN npx motion-primitives@latest add text-loop
RUN npx motion-primitives@latest add text-morph
RUN npx motion-primitives@latest add text-roll
RUN npx motion-primitives@latest add text-scramble
RUN npx motion-primitives@latest add text-shimmer
RUN npx motion-primitives@latest add text-shimmer-wave
RUN npx motion-primitives@latest add animated-number
RUN npx motion-primitives@latest add sliding-number
RUN npx motion-primitives@latest add dock
RUN npx motion-primitives@latest add glow-effect
RUN npx motion-primitives@latest add image-comparison
RUN npx motion-primitives@latest add scroll-progress
RUN npx motion-primitives@latest add spotlight
RUN npx motion-primitives@latest add spinning-text
RUN npx motion-primitives@latest add tilt
RUN npx motion-primitives@latest add toolbar-dynamic
RUN npx motion-primitives@latest add toolbar-expandable
RUN npx motion-primitives@latest add magnetic
RUN npx motion-primitives@latest add morphing-dialog
RUN npx motion-primitives@latest add morphing-popover
RUN npx motion-primitives@latest add progressive-blur

# Create lib/utils.ts for cn utility (in case it wasn't created by init)
RUN mkdir -p lib && echo 'import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}' > lib/utils.ts

# Create environment file with hardcoded values for sandbox
RUN echo 'NEXTAUTH_SECRET="sandbox-secret-key-for-demo-purposes-only-not-for-production"\nNEXTAUTH_URL="http://localhost:3000"\nDATABASE_URL="file:./dev.db"' > .env.local

# Initialize Prisma for NextAuth (SQLite for sandbox simplicity)
RUN npx prisma init --datasource-provider sqlite

# Move the Next.js app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app