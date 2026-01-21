// Blog Data - Centralized JSON-like structure for easy blog management
// To add a new blog, simply add a new object to the blogs array below

const BLOG_DATA = {
    "blogs": [
        {
            "id": "database-over-indexing",
            "slug": "database-over-indexing-performance",
            "title": "Database Over-Indexing: When More Indexes Actually Hurt Performance",
            "subtitle": "A Deep Dive into Index Strategy for High-Performance Applications",
            "author": "Utkarsh Shukla",
            "authorImage": "assets/img/utslogo.jpg",
            "date": "2026-01-20",
            "readTime": "12 min read",
            "category": "Backend Strategy",
            "tags": ["Database", "Performance", "MySQL", "PostgreSQL", "Optimization"],
            "featuredImage": "assets/images/blog/over-indexing.png",
            "excerpt": "Indexes are often treated as a silver bullet for database performance, but experienced developers know that over-indexing can be just as harmful as under-indexing. Learn the strategies to find the right balance.",
            "content": [
                {
                    "type": "paragraph",
                    "text": "As backend developers, we've all been there—a slow query appears, and our first instinct is to add an index. But here's a truth that separates senior engineers from juniors: **more indexes don't always mean better performance**. In fact, over-indexing can cripple your database's write performance, bloat your storage, and introduce subtle bugs that are incredibly hard to diagnose."
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "The Hidden Costs of Indexes"
                },
                {
                    "type": "paragraph",
                    "text": "Every index you create comes with hidden costs that compound over time:"
                },
                {
                    "type": "list",
                    "items": [
                        "**Write Overhead**: Every INSERT, UPDATE, and DELETE must update all relevant indexes. With 10 indexes on a table, you're doing 10x the write work.",
                        "**Storage Bloat**: Indexes consume disk space—sometimes more than the table itself. I've seen production databases where indexes were 3x larger than the actual data.",
                        "**Memory Pressure**: The query optimizer needs to keep index statistics in memory. More indexes = more memory consumption.",
                        "**Optimizer Confusion**: With too many indexes, the query planner might choose suboptimal execution plans, leading to slower queries."
                    ]
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "Real-World Case Study: The E-Commerce Disaster"
                },
                {
                    "type": "paragraph",
                    "text": "In one of my projects, an e-commerce platform was experiencing severe performance degradation during peak sales. The orders table had **23 indexes**—added over time by different developers solving different problems. Here's what we found:"
                },
                {
                    "type": "code",
                    "language": "sql",
                    "code": "-- The problematic table structure\nCREATE TABLE orders (\n    id BIGINT PRIMARY KEY,\n    user_id BIGINT,\n    product_id BIGINT,\n    status VARCHAR(50),\n    created_at TIMESTAMP,\n    updated_at TIMESTAMP,\n    -- ... 15 more columns\n);\n\n-- Too many overlapping indexes!\nCREATE INDEX idx_user ON orders(user_id);\nCREATE INDEX idx_user_status ON orders(user_id, status);\nCREATE INDEX idx_user_created ON orders(user_id, created_at);\nCREATE INDEX idx_user_status_created ON orders(user_id, status, created_at);\n-- ... 19 more indexes"
                },
                {
                    "type": "paragraph",
                    "text": "The solution? We analyzed query patterns using `EXPLAIN ANALYZE` and consolidated to just **5 carefully designed composite indexes**. The result:"
                },
                {
                    "type": "list",
                    "items": [
                        "INSERT latency dropped from 45ms to 8ms (82% improvement)",
                        "Storage reduced by 2.3GB",
                        "Peak throughput increased by 340%"
                    ]
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "The Golden Rules of Indexing Strategy"
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "1. Analyze Before You Index"
                },
                {
                    "type": "paragraph",
                    "text": "Never add an index without evidence. Use these tools:"
                },
                {
                    "type": "code",
                    "language": "sql",
                    "code": "-- MySQL: Enable slow query log\nSET GLOBAL slow_query_log = 'ON';\nSET GLOBAL long_query_time = 1;\n\n-- PostgreSQL: Enable pg_stat_statements\nCREATE EXTENSION pg_stat_statements;\nSELECT query, calls, mean_time, total_time\nFROM pg_stat_statements\nORDER BY total_time DESC\nLIMIT 20;"
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "2. Understand Composite Index Column Order"
                },
                {
                    "type": "paragraph",
                    "text": "The order of columns in a composite index matters tremendously. Follow the **ESR Rule** (Equality, Sort, Range):"
                },
                {
                    "type": "code",
                    "language": "sql",
                    "code": "-- Query pattern\nSELECT * FROM orders \nWHERE status = 'completed'     -- Equality\n  AND user_id = 123            -- Equality  \n  AND created_at > '2026-01-01' -- Range\nORDER BY created_at DESC;       -- Sort\n\n-- Optimal index\nCREATE INDEX idx_optimal ON orders(status, user_id, created_at);"
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "3. Audit Indexes Regularly"
                },
                {
                    "type": "paragraph",
                    "text": "Set up quarterly index audits. Here's a query to find unused indexes:"
                },
                {
                    "type": "code",
                    "language": "sql",
                    "code": "-- PostgreSQL: Find unused indexes\nSELECT \n    schemaname || '.' || relname AS table,\n    indexrelname AS index,\n    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,\n    idx_scan AS times_used\nFROM pg_stat_user_indexes ui\nJOIN pg_index i ON ui.indexrelid = i.indexrelid\nWHERE NOT indisunique \n  AND idx_scan < 50\nORDER BY pg_relation_size(i.indexrelid) DESC;"
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "Key Takeaways"
                },
                {
                    "type": "list",
                    "items": [
                        "Treat indexes as a trade-off between read and write performance",
                        "Always measure query patterns before adding indexes",
                        "Consolidate overlapping indexes into efficient composite indexes",
                        "Audit and remove unused indexes quarterly",
                        "Document why each index exists in your schema"
                    ]
                },
                {
                    "type": "paragraph",
                    "text": "Remember: **The best index is one that serves multiple query patterns efficiently, not one index per query.**"
                }
            ]
        },
        {
            "id": "race-conditions-resource-locking",
            "slug": "race-conditions-resource-locking-strategies",
            "title": "Race Conditions & Resource Locking: Battle-Tested Strategies for Concurrent Systems",
            "subtitle": "How to Build Robust Applications That Don't Break Under Concurrency",
            "author": "Utkarsh Shukla",
            "authorImage": "assets/img/utslogo.jpg",
            "date": "2026-01-22",
            "readTime": "15 min read",
            "category": "Backend Strategy",
            "tags": ["Concurrency", "Distributed Systems", "Locking", "Redis", "Database"],
            "featuredImage": "assets/images/blog/race-conditions.png",
            "excerpt": "Race conditions are the silent killers of production systems. They pass all tests, work perfectly in development, and only manifest when real users hit your system. Here's how to identify, prevent, and handle them.",
            "content": [
                {
                    "type": "paragraph",
                    "text": "I once spent 72 hours debugging a production issue where users were being charged twice for the same order. The code looked perfect. Tests passed. Code review approved. But under high concurrency, a race condition manifested that **cost the company $47,000** before we caught it. This experience taught me that concurrency bugs are the most expensive bugs you'll ever ship."
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "Understanding Race Conditions"
                },
                {
                    "type": "paragraph",
                    "text": "A race condition occurs when the behavior of software depends on the relative timing of events, such as the order of thread execution. Here's the classic \"double-spend\" scenario:"
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// Dangerous: Race condition in payment processing\npublic function processPayment(Order $order) \n{\n    // Thread A reads: isPaid = false\n    // Thread B reads: isPaid = false (simultaneous!)\n    if (!$order->isPaid()) {\n        $this->chargeCustomer($order);  // Both threads execute this!\n        $order->markAsPaid();\n    }\n}"
                },
                {
                    "type": "paragraph",
                    "text": "Both threads see `isPaid = false` because neither has committed yet. Result: customer charged twice."
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "The Locking Toolkit: Choosing the Right Strategy"
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "1. Pessimistic Locking (Database-Level)"
                },
                {
                    "type": "paragraph",
                    "text": "Use when: Write contention is high, and you need guaranteed consistency."
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// Laravel: Pessimistic locking with FOR UPDATE\npublic function processPayment(Order $order)\n{\n    DB::transaction(function () use ($order) {\n        // Lock the row - other transactions wait\n        $order = Order::where('id', $order->id)\n            ->lockForUpdate()\n            ->first();\n        \n        if (!$order->isPaid()) {\n            $this->chargeCustomer($order);\n            $order->markAsPaid();\n            $order->save();\n        }\n    });\n}"
                },
                {
                    "type": "paragraph",
                    "text": "**Pros**: Simple, guaranteed consistency. **Cons**: Can cause deadlocks, reduces throughput."
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "2. Optimistic Locking (Version-Based)"
                },
                {
                    "type": "paragraph",
                    "text": "Use when: Read-heavy workloads with occasional writes."
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// Model with version tracking\nclass Order extends Model\n{\n    protected $fillable = ['amount', 'status', 'version'];\n}\n\npublic function processPayment(Order $order)\n{\n    $currentVersion = $order->version;\n    \n    // Attempt update with version check\n    $updated = Order::where('id', $order->id)\n        ->where('version', $currentVersion)\n        ->where('status', '!=', 'paid')\n        ->update([\n            'status' => 'paid',\n            'version' => $currentVersion + 1\n        ]);\n    \n    if ($updated === 0) {\n        // Another process modified the order - retry or fail\n        throw new ConcurrencyException('Order was modified by another process');\n    }\n    \n    $this->chargeCustomer($order);\n}"
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "3. Distributed Locking with Redis"
                },
                {
                    "type": "paragraph",
                    "text": "Use when: Multiple application servers need to coordinate access to shared resources."
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// Redis distributed lock implementation\nuse Illuminate\\Support\\Facades\\Cache;\n\npublic function processPayment(Order $order)\n{\n    $lockKey = \"order_lock:{$order->id}\";\n    \n    // Acquire lock with 30 second TTL\n    $lock = Cache::lock($lockKey, 30);\n    \n    try {\n        // Block for max 10 seconds waiting for lock\n        if ($lock->block(10)) {\n            $order->refresh(); // Reload fresh data\n            \n            if (!$order->isPaid()) {\n                $this->chargeCustomer($order);\n                $order->markAsPaid();\n                $order->save();\n            }\n        } else {\n            throw new LockTimeoutException('Could not acquire lock');\n        }\n    } finally {\n        $lock->release();\n    }\n}"
                },
                {
                    "type": "heading",
                    "level": 3,
                    "text": "4. Idempotency Keys"
                },
                {
                    "type": "paragraph",
                    "text": "Use when: Protecting against duplicate API requests (retries, network issues)."
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// Idempotency middleware\npublic function handle(Request $request, Closure $next)\n{\n    $idempotencyKey = $request->header('Idempotency-Key');\n    \n    if ($idempotencyKey) {\n        $cacheKey = \"idempotency:{$idempotencyKey}\";\n        \n        // Check if request was already processed\n        if ($cachedResponse = Cache::get($cacheKey)) {\n            return response()->json(\n                json_decode($cachedResponse, true),\n                200,\n                ['X-Idempotent-Replayed' => 'true']\n            );\n        }\n        \n        $response = $next($request);\n        \n        // Cache response for 24 hours\n        Cache::put($cacheKey, $response->getContent(), 86400);\n        \n        return $response;\n    }\n    \n    return $next($request);\n}"
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "Deadlock Prevention Strategies"
                },
                {
                    "type": "paragraph",
                    "text": "Deadlocks occur when two or more transactions wait for each other to release locks. Prevention strategies:"
                },
                {
                    "type": "list",
                    "items": [
                        "**Consistent Lock Ordering**: Always acquire locks in the same order across all transactions",
                        "**Lock Timeouts**: Set reasonable timeouts and retry with exponential backoff",
                        "**Minimize Lock Scope**: Hold locks for the shortest time possible",
                        "**Avoid User Interaction While Holding Locks**: Never wait for external input while holding a lock"
                    ]
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// Retry with exponential backoff\npublic function executeWithRetry(callable $operation, int $maxRetries = 3)\n{\n    $attempt = 0;\n    \n    while ($attempt < $maxRetries) {\n        try {\n            return $operation();\n        } catch (DeadlockException $e) {\n            $attempt++;\n            if ($attempt >= $maxRetries) throw $e;\n            \n            // Exponential backoff: 100ms, 200ms, 400ms...\n            usleep(100000 * pow(2, $attempt - 1));\n        }\n    }\n}"
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "Testing for Race Conditions"
                },
                {
                    "type": "paragraph",
                    "text": "Race conditions are notoriously hard to test because they depend on timing. Here's a testing strategy:"
                },
                {
                    "type": "code",
                    "language": "php",
                    "code": "// PHPUnit test for concurrent access\npublic function test_payment_handles_concurrent_requests()\n{\n    $order = Order::factory()->create(['status' => 'pending', 'amount' => 100]);\n    \n    $promises = [];\n    \n    // Simulate 10 concurrent payment attempts\n    for ($i = 0; $i < 10; $i++) {\n        $promises[] = async(function () use ($order) {\n            return $this->paymentService->processPayment($order->id);\n        });\n    }\n    \n    $results = await($promises);\n    \n    // Only ONE payment should succeed\n    $successCount = collect($results)->filter(fn($r) => $r->success)->count();\n    $this->assertEquals(1, $successCount);\n    \n    // Customer should be charged exactly once\n    $this->assertEquals(1, Payment::where('order_id', $order->id)->count());\n}"
                },
                {
                    "type": "heading",
                    "level": 2,
                    "text": "Key Takeaways"
                },
                {
                    "type": "list",
                    "items": [
                        "Race conditions are expensive—invest in prevention upfront",
                        "Choose your locking strategy based on read/write ratio and scale requirements",
                        "Always use idempotency keys for payment and critical operations",
                        "Implement retry logic with exponential backoff for deadlock recovery",
                        "Test concurrency explicitly—don't assume single-threaded behavior"
                    ]
                },
                {
                    "type": "paragraph",
                    "text": "Remember: **The cost of preventing race conditions is always less than the cost of fixing them in production.**"
                }
            ]
        }
    ],
    "categories": [
        { "id": "backend-strategy", "name": "Backend Strategy", "color": "#ff014f" },
        { "id": "frontend", "name": "Frontend", "color": "#4facfe" },
        { "id": "devops", "name": "DevOps", "color": "#667eea" },
        { "id": "architecture", "name": "Architecture", "color": "#f093fb" }
    ]
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.BLOG_DATA = BLOG_DATA;
}
