const Anthropic = require('@anthropic-ai/sdk');

// Replace with your NEW API key (revoke the old one - it was exposed)
const API_KEY = ''; // TODO: populate via env

const client = new Anthropic({ apiKey: API_KEY });

async function analyzeLegalIssue(title, body) {
    const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: 'You are a senior legal analyst. Provide structured analysis with classification, priority, key considerations, and recommended actions. All output is a draft for attorney review.',
        messages: [{
            role: 'user',
            content: `Analyze this legal issue:

Title: ${title}
Body: ${body || 'No description provided'}

Provide:
1. Classification (contract/compliance/litigation/IP/etc)
2. Priority (urgent/high/medium/low)
3. Key legal considerations
4. Recommended action items
5. Suggested response draft`
        }]
    });
    return response.content[0].text;
}

async function reviewContract(contractText) {
    const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: 'You are a contract review specialist. Identify risks using GREEN/YELLOW/RED ratings. Flag missing protections and suggest alternative language.',
        messages: [{
            role: 'user',
            content: `Review this contract and provide structured analysis:

${contractText}

Format:
- Document type
- Executive summary
- Risk findings table: [Clause | Finding | Risk Level | Recommendation]
- Key terms extracted`
        }]
    });
    return response.content[0].text;
}

async function draftBrief(facts, issues, relief) {
    const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        system: 'You are a legal brief writer. Draft persuasive arguments with proper structure. Flag uncertain citations with [VERIFY].',
        messages: [{
            role: 'user',
            content: `Draft a legal brief:

FACTS: ${facts}
LEGAL ISSUES: ${issues}
REQUESTED RELIEF: ${relief}

Include: Statement of Facts, Questions Presented, Argument, Conclusion.`
        }]
    });
    return response.content[0].text;
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === 'help') {
        console.log(`
Claude Legal Assistant
======================
Commands:
  node legal-bot.js issue "Title" "Body"
  node legal-bot.js contract "path/to/contract.txt"
  node legal-bot.js brief "facts" "issues" "relief"
  node legal-bot.js test

Examples:
  node legal-bot.js issue "Vendor breached NDA" "They shared our code"
  node legal-bot.js contract ./contract.txt
  node legal-bot.js brief "Defendant failed to deliver" "Breach of contract" "Damages $50k"
        `);
        return;
    }

    try {
        switch(command) {
            case 'test':
                console.log('Testing Claude connection...');
                const test = await client.messages.create({
                    model: 'claude-sonnet-4-6',
                    max_tokens: 100,
                    messages: [{role: 'user', content: 'Say hello'}]
                });
                console.log('SUCCESS:', test.content[0].text);
                break;

            case 'issue':
                const title = args[1] || 'Untitled';
                const body = args[2] || '';
                console.log('Analyzing issue...');
                const analysis = await analyzeLegalIssue(title, body);
                console.log('\n=== LEGAL ISSUE ANALYSIS ===\n');
                console.log(analysis);
                break;

            case 'contract':
                const fs = require('fs');
                const path = args[1];
                if (!path) {
                    console.error('Error: Provide contract file path');
                    return;
                }
                const contractText = fs.readFileSync(path, 'utf8');
                console.log('Reviewing contract...');
                const review = await reviewContract(contractText);
                console.log('\n=== CONTRACT REVIEW ===\n');
                console.log(review);
                break;

            case 'brief':
                const briefFacts = args[1] || '';
                const briefIssues = args[2] || '';
                const briefRelief = args[3] || '';
                console.log('Drafting brief...');
                const brief = await draftBrief(briefFacts, briefIssues, briefRelief);
                console.log('\n=== LEGAL BRIEF ===\n');
                console.log(brief);
                break;

            default:
                console.log('Unknown command. Run: node legal-bot.js help');
        }
    } catch (error) {
        console.error('ERROR:', error.status, error.message);
        if (error.status === 401) {
            console.error('Your API key is invalid. Get a new one at console.anthropic.com');
        }
    }
}

main();
