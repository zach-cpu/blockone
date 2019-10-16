//Smoke test, test suite
describe('Smoke Test', function() {

    //start with freshly loaded page
    //verify button and table are present, fail fast if not
    beforeEach(function() {
        cy.visit('/')
        cy.get('[data-cy=load]')
        cy.get('[data-cy=table]')
    })


    //verify app loads and table is empty
    it('verifies table has no initial block data', function() {
        cy.get('[data-cy=table]')
            .find('tr')
            .should('have.length', 0)
    })
    
    //click load and verify 10 blocks in populated block table
    //expand first block and verify block content is syntactically correct
    it('Loads 10 blocks into table, expands first block and verifies block data is present and valid', function() {
        cy.get('[data-cy=load]')
            .click()   
        cy.get('[data-cy=table]')
            .find('tr')
            .should('have.length', 10) 
        //valid hash    
        cy.get('[data-cy=row1] > td > [data-cy=block-headers] > [data-cy=block-id]').should(($blockID) => {
                expect($blockID.text()).to.match(/^[a-f0-9]{64}$/gm)
            })
        //valid timestamp
        cy.get('[data-cy=row1] > td > [data-cy=block-headers] >  [data-cy=timestamp]').should(($timestamp) => {
            expect($timestamp.text()).to.match(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9].[0-9]{3}/gm)
            })
        //valid action count
        cy.get('[data-cy=row1] > td > [data-cy=block-headers] > [data-cy=action-count]').should(($actionCount) => {
            expect($actionCount.text()).to.match(/^[0-9]*[ \t]+$/gm)
            })
        //expand row
        cy.get('[data-cy=row1]')
            .click()
        //verify content is visible and not empty and is valid JSON
        cy.get('[data-cy=expanded-row1]')
            .should('be.visible')
            .should('not.be.empty')
            //caused timeout, test JSON validity in e2e test with stubbed data
/*             .should(($jsonData) => {
                expect($jsonData.text()).to.match(/\"\{.*\:\{.*\:.*\}\}\"/) 
            })  */
    })

    //load 10 blocks, then load 10 more blocks
    it('Loads 10 blocks, then loads up to 10 new blocks', function() {
        //get first set of blocks
        cy.get('[data-cy=load]')
            .click()   
        cy.get('[data-cy=table]')
            .find('tr')
            .should('have.length', 10)
            
        //store timestamp of first block
        cy.get('[data-cy=row1] > td > [data-cy=block-headers] > [data-cy=block-id]').then(($timestamp) => {

            const timestamp1 = $timestamp.text()
            //get next set of blocks
            cy.get('[data-cy=load]')
                .click()   
            cy.get('[data-cy=table]')
                .find('tr')
                .should('have.length', 10) 

            //timestamp of first block should be different in this set of blocks
            cy.get('[data-cy=row1] > td > [data-cy=block-headers] > [data-cy=block-id]').should(($timestamp2) => {
                    expect($timestamp2.text()).not.to.eq(timestamp1)
                })    
            })
    })
})