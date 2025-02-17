function show(tab) {
    if (tab === 'externalTools') {
        document.getElementById('externalTab').classList.remove('hidden');
        document.getElementById('catalogTab').classList.add('hidden');
        document.getElementById('xslTab').classList.add('hidden');
        document.getElementById('externalButton').classList.add('selectedTab');
        document.getElementById('catalogButton').classList.remove('selectedTab');
        document.getElementById('parametersButton').classList.remove('selectedTab');
    }
    if (tab === 'xmlCatalog') {
        document.getElementById('externalTab').classList.add('hidden');
        document.getElementById('catalogTab').classList.remove('hidden');
        document.getElementById('xslTab').classList.add('hidden');
        document.getElementById('externalButton').classList.remove('selectedTab');
        document.getElementById('catalogButton').classList.add('selectedTab');
        document.getElementById('parametersButton').classList.remove('selectedTab');
    }
    if (tab === 'xslParameters') {
        document.getElementById('externalTab').classList.add('hidden');
        document.getElementById('catalogTab').classList.add('hidden');
        document.getElementById('xslTab').classList.remove('hidden');
        document.getElementById('externalButton').classList.remove('selectedTab');
        document.getElementById('catalogButton').classList.remove('selectedTab');
        document.getElementById('parametersButton').classList.add('selectedTab');
    }
}

function parameters(value) {
    if (value === 'commonTab') {
        document.getElementById('commonParameters').classList.remove('hidden');
        document.getElementById('xsl-foParameters').classList.add('hidden');
        document.getElementById('htmlParameters').classList.add('hidden');
        document.getElementById('epubParameters').classList.add('hidden');
        document.getElementById('helpParameters').classList.add('hidden');
        document.getElementById('commonButton').classList.add('selectedTab');
        document.getElementById('xsl-foButton').classList.remove('selectedTab');
        document.getElementById('htmlButton').classList.remove('selectedTab');
        document.getElementById('epubButton').classList.remove('selectedTab');
        document.getElementById('helpButton').classList.remove('selectedTab');
    }
    if (value === 'xsl-foTab') {
        document.getElementById('commonParameters').classList.add('hidden');
        document.getElementById('xsl-foParameters').classList.remove('hidden');
        document.getElementById('htmlParameters').classList.add('hidden');
        document.getElementById('epubParameters').classList.add('hidden');
        document.getElementById('helpParameters').classList.add('hidden');
        document.getElementById('commonButton').classList.remove('selectedTab');
        document.getElementById('xsl-foButton').classList.add('selectedTab');
        document.getElementById('htmlButton').classList.remove('selectedTab');
        document.getElementById('epubButton').classList.remove('selectedTab');
        document.getElementById('helpButton').classList.remove('selectedTab');
    }
    if (value === 'htmlTab') {
        document.getElementById('commonParameters').classList.add('hidden');
        document.getElementById('xsl-foParameters').classList.add('hidden');
        document.getElementById('htmlParameters').classList.remove('hidden');
        document.getElementById('epubParameters').classList.add('hidden');
        document.getElementById('helpParameters').classList.add('hidden');
        document.getElementById('commonButton').classList.remove('selectedTab');
        document.getElementById('xsl-foButton').classList.remove('selectedTab');
        document.getElementById('htmlButton').classList.add('selectedTab');
        document.getElementById('epubButton').classList.remove('selectedTab');
        document.getElementById('helpButton').classList.remove('selectedTab');
    }
    if (value === 'epubTab') {
        document.getElementById('commonParameters').classList.add('hidden');
        document.getElementById('xsl-foParameters').classList.add('hidden');
        document.getElementById('htmlParameters').classList.add('hidden');
        document.getElementById('epubParameters').classList.remove('hidden');
        document.getElementById('helpParameters').classList.add('hidden');
        document.getElementById('commonButton').classList.remove('selectedTab');
        document.getElementById('xsl-foButton').classList.remove('selectedTab');
        document.getElementById('htmlButton').classList.remove('selectedTab');
        document.getElementById('epubButton').classList.add('selectedTab');
        document.getElementById('helpButton').classList.remove('selectedTab');
    }
    if (value === 'helpTab') {
        document.getElementById('commonParameters').classList.add('hidden');
        document.getElementById('xsl-foParameters').classList.add('hidden');
        document.getElementById('htmlParameters').classList.add('hidden');
        document.getElementById('epubParameters').classList.add('hidden');
        document.getElementById('helpParameters').classList.remove('hidden');
        document.getElementById('commonButton').classList.remove('selectedTab');
        document.getElementById('xsl-foButton').classList.remove('selectedTab');
        document.getElementById('htmlButton').classList.remove('selectedTab');
        document.getElementById('epubButton').classList.remove('selectedTab');
        document.getElementById('helpButton').classList.add('selectedTab');
    }
}