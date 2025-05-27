document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const workflowCanvas = document.getElementById('workflowCanvas');
    const createRuleBtn = document.getElementById('createRuleBtn');
    const configPanel = document.getElementById('configPanel');
    
    // Sample node templates
    const nodeTemplates = {
        trigger: {
            title: 'ETH Balance Trigger',
            icon: 'fa-ethereum',
            description: 'Triggers when ETH balance meets condition',
            type: 'trigger',
            config: {
                chain: 'Arbitrum',
                token: 'ETH',
                condition: '>',
                value: '1'
            }
        },
        action: {
            title: 'Stake ICP',
            icon: 'fa-coins',
            description: 'Auto-stake ICP at 7% APY',
            type: 'action',
            config: {
                protocol: 'ICP Staking',
                amount: '100%',
                apy: '7%'
            }
        }
    };

    // Initialize SVG for connections
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    workflowCanvas.appendChild(svg);

    // Create new rule button click handler
    createRuleBtn.addEventListener('click', function() {
        // Clear canvas
        workflowCanvas.querySelectorAll('.node').forEach(node => node.remove());
        
        // Create sample nodes
        createNode(nodeTemplates.trigger, 50, 50);
        createNode(nodeTemplates.action, 300, 50);
    });

    // Create a draggable node
    function createNode(template, x, y) {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.dataset.type = template.type;
        
        node.innerHTML = `
            <div class="node-header">
                <i class="node-icon fas ${template.icon}"></i>
                <div class="node-title">${template.title}</div>
            </div>
            <div class="node-body">${template.description}</div>
            <div class="node-connector input"></div>
            <div class="node-connector output"></div>
        `;
        
        workflowCanvas.appendChild(node);
        makeDraggable(node);
        
        // Node click handler for configuration
        node.addEventListener('click', function(e) {
            if (e.target.classList.contains('node-connector')) return;
            showNodeConfig(template);
        });
        
        return node;
    }

    // Make nodes draggable
    function makeDraggable(node) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        node.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            if (e.target.classList.contains('node-connector')) return;
            
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            node.style.top = (node.offsetTop - pos2) + "px";
            node.style.left = (node.offsetLeft - pos1) + "px";
            updateConnections();
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Show node configuration in right panel
    function showNodeConfig(template) {
        let configHTML = '';
        
        if (template.type === 'trigger') {
            configHTML = `
                <div class="space-y-4">
                    <h3 class="font-medium">${template.title}</h3>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Blockchain</label>
                        <select class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            <option>Arbitrum</option>
                            <option>Ethereum</option>
                            <option>Polygon</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Token</label>
                        <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" value="${template.config.token}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <div class="flex space-x-2">
                            <select class="flex-1 border border-gray-300 rounded-lg px-3 py-2">
                                <option>></option>
                                <option><</option>
                                <option>=</option>
                            </select>
                            <input type="text" class="flex-1 border border-gray-300 rounded-lg px-3 py-2" value="${template.config.value}">
                        </div>
                    </div>
                </div>
            `;
        } else if (template.type === 'action') {
            configHTML = `
                <div class="space-y-4">
                    <h3 class="font-medium">${template.title}</h3>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
                        <select class="w-full border border-gray-300 rounded-lg px-3 py-2">
                            <option>ICP Staking</option>
                            <option>Liquid Staking</option>
                            <option>Yield Farming</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" value="${template.config.amount}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">APY</label>
                        <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2" value="${template.config.apy}">
                    </div>
                </div>
            `;
        }
        
        configPanel.innerHTML = configHTML;
    }

    // Update connections between nodes
    function updateConnections() {
        // Clear existing connections
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }
        
        // In a real implementation, we would track connections and redraw them
        // This is a placeholder for the actual connection logic
    }

    // Initialize with sample nodes
    createRuleBtn.click();
    
    // Add technical flow diagram to config panel
    const techFlowHTML = `
        <div class="tech-flow-diagram">
            <h3 class="font-medium mb-3">Technical Flow</h3>
            <div class="tech-flow-step">
                <div class="tech-flow-icon"><i class="fas fa-key"></i></div>
                <div class="tech-flow-text">Chain-key signatures verify transaction</div>
            </div>
            <div class="tech-flow-step">
                <div class="tech-flow-icon"><i class="fas fa-cloud"></i></div>
                <div class="tech-flow-text">HTTPS outcalls fetch external data</div>
            </div>
            <div class="tech-flow-step">
                <div class="tech-flow-icon"><i class="fas fa-heartbeat"></i></div>
                <div class="tech-flow-text">Canister heartbeat checks conditions</div>
            </div>
            <div class="tech-flow-step">
                <div class="tech-flow-icon"><i class="fas fa-certificate"></i></div>
                <div class="tech-flow-text">Proof-of-Action NFT is minted</div>
            </div>
        </div>
    `;
    
    configPanel.insertAdjacentHTML('beforeend', techFlowHTML);
});